import { APIGatewayTokenAuthorizerEvent } from 'aws-lambda';
import jwksClient from 'jwks-rsa';
import { decode, verify } from 'jsonwebtoken';

// Initialize JWKS Client
const Client = jwksClient({
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5,
  jwksUri: process.env.AUTH0_JWKS_URI || '',
});

/**
 * Get the token from the APIGatewayEvent
 * @param event The event to parse
 */
export const getToken = (event: APIGatewayTokenAuthorizerEvent): string => {
  if (!event.type || event.type !== 'TOKEN') {
    throw new Error('Expected "event.type" parameter to have value "TOKEN"');
  }

  const tokenString = event.authorizationToken;
  if (!tokenString) {
    throw new Error('Expected "event.authorizationToken" parameter to be set');
  }

  const match = tokenString.match(/^Bearer (.*)$/);
  if (!match || match.length < 2) {
    throw new Error(
      `Invalid Authorization token - ${tokenString} does not match "Bearer .*"`
    );
  }
  return match[1];
};

/**
 * Get the signing key from Auth0
 * @param kid
 */
export const getSigningKey = async (kid: string) => {
  const res = await Client.getSigningKeyAsync(kid);
  return res.getPublicKey();
};

/**
 * The decoded token should have these details in the payload
 */
export interface DecodedTokenPayload {
  sub: string;
  aud: string;
  iat: number;
  exp: number;
  azp: string;
  gty: string;
}

interface DecodedTokenHeader {
  alg: 'RS256';
  typ: 'JWT';
  kid: string;
}

interface DecodedToken {
  header: DecodedTokenHeader;
  payload: DecodedTokenPayload;
}

/**
 * Verify whether the token is correct or not
 * @param token The token to check
 * @param signingKey The signing key to use to check it
 */
export const verifyToken = (token: string, signingKey: string) => {
  return verify(token, signingKey, {
    audience: process.env.AUTH0_AUDIENCE || '',
    issuer: process.env.AUTH0_ISSUER || '',
    algorithms: ['RS256'],
  });
};

/**
 * Authenticate against Auth0
 * @param event The API Gateway Event
 */
export const authenticate = async (
  event: APIGatewayTokenAuthorizerEvent
): Promise<DecodedTokenPayload> => {
  const token = getToken(event);

  const decoded = decode(token, { complete: true }) as DecodedToken;
  if (!decoded || !decoded.header || !decoded.header.kid) {
    throw new Error('Invalid Token');
  }
  const signingKey = await getSigningKey(decoded.header.kid);
  return verifyToken(token, signingKey) as DecodedTokenPayload;
};
