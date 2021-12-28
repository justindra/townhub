import * as Sentry from '@sentry/node';
import {
  APIGatewayProxyEventV2,
  APIGatewayProxyHandlerV2,
  Context,
} from 'aws-lambda';
import { BaseException } from '../base';
import { DEFAULT_TIMEZONE } from '../helpers';

Sentry.init({
  dsn: process.env.SENTRY_DSN || '',
  environment: process.env.STAGE || process.env.NODE_ENV || 'dev',
});

const DEFAULT_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

export interface HandlerResult<TData = any> {
  message: string;
  data: TData;
  statusCode?: number;
}

export interface HandlerDetails<TPathParameters = any> {
  townId: string;
  timezone: string;
  userId: string;
  pathParameters: TPathParameters;
}

export type HandlerFunction<TDataResult = any, TPathParameters = any> = (
  details: HandlerDetails<TPathParameters>,
  event: APIGatewayProxyEventV2,
  context: Context
) => HandlerResult<TDataResult> | Promise<HandlerResult<TDataResult>>;

/**
 * A wrapper around any API Gateway Requests. Allowing any errors to be
 * captured and sent to Sentry
 * @param handler
 */
export const ApiGatewayWrapper = <TDataResult = any, TPathParameters = any>(
  handler: HandlerFunction<TDataResult, TPathParameters>
): APIGatewayProxyHandlerV2 => {
  return async (event, context) => {
    try {
      const townId =
        event.headers['town-id'] ?? event.headers['Town-Id'] ?? 'n/a';
      const userId =
        event.headers['user-id'] ?? event.headers['User-Id'] ?? 'public';

      Sentry.setUser({ id: userId });
      Sentry.setContext('Town', { townId });

      const pathParameters: TPathParameters =
        ((event.pathParameters as unknown) as TPathParameters) ??
        ({} as TPathParameters);

      const timezone = DEFAULT_TIMEZONE;

      const result = await handler(
        { townId, userId, pathParameters, timezone },
        event,
        context
      );
      return {
        statusCode: result.statusCode || 200,
        body: JSON.stringify({
          message: result.message,
          data: result.data,
        }),
        headers: DEFAULT_HEADERS,
      };
    } catch (error) {
      Sentry.setContext('AWS Context', context);
      Sentry.setContext('Event', event);
      Sentry.captureException(error);
      await Sentry.flush(2000);

      return {
        statusCode: (error as BaseException).statusCode || 500,
        body: JSON.stringify({
          message: (error as BaseException).message || 'Something went wrong',
          error: error,
        }),
        headers: DEFAULT_HEADERS,
      };
    }
  };
};
