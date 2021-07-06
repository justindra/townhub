import * as sst from '@serverless-stack/resources';

class CrudEndpoints {
  constructor(
    scope: sst.Stack,
    api: sst.Api,
    baseRoute: string,
    idFieldName: string
  ) {
    api.addRoutes(scope, {
      // List all
      [`GET    /${baseRoute}`]: 'src/test.main',
      // Create a new one
      [`POST   /${baseRoute}`]: 'src/lambda.handler',
      // Get a single instance
      [`GET    /${baseRoute}/{${idFieldName}}`]: 'src/lambda.handlerEvent',
      // Update a single instance
      [`PUT    /${baseRoute}/{${idFieldName}}`]: 'src/lambda.handler',
      // Delete a single instance
      [`DELETE /${baseRoute}`]: 'src/lambda.handler',
    });
  }
}

export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    // Create a HTTP API
    const api = new sst.Api(this, 'Api', {
      routes: {
        'GET /': 'src/lambda.handler',
      },
      defaultFunctionProps: {
        bundle: { nodeModules: ['@sentry/node'] },
      },
    });

    new CrudEndpoints(this, api, 'modules', 'moduleId');

    api.addRoutes(this, {
      'GET /modules/{moduleId}/shuttles/{shuttleId}': {
        handler: 'src/test.main',
        functionName: 'test',
      },
    });

    // Show the endpoint in the output
    this.addOutputs({
      ApiEndpoint: api.url,
    });
  }
}
