/* istanbul ignore file */
/**
 * We are ignoring this file for code coverage checks as it should not affect
 * things. As it is just a way to tidy up our errors.
 */

/**
 * Exception created when a user is unauthenticated
 */
export class UnauthenticatedException extends Error {
  statusCode = 401;
  constructor(message: string = 'User is not authenticated') {
    super(message);
    this.name = 'UnauthenticatedException';
    // Set the prototype explicitly.
    // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, UnauthenticatedException.prototype);
  }
}

/**
 * Exception created when a user is authenticated but does not have the correct
 * role or permissions to do what they want to do
 */
export class UnauthorizedException extends UnauthenticatedException {
  statusCode = 403;
  constructor(message: string = 'User does not have the correct role') {
    super(message);
    this.name = 'UnauthorizedException';
    // Set the prototype explicitly.
    // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, UnauthorizedException.prototype);
  }
}

/**
 * Exception created when an item is not found
 */
export class NotFoundException extends Error {
  statusCode = 404;

  constructor(message: string) {
    super(message);
    this.name = 'NotFoundException';
    // Set the prototype explicitly.
    // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}

/**
 * Exception created when an item is not found
 */
export class ValidationException extends Error {
  statusCode = 400;

  constructor(message: string) {
    super(message);
    this.name = 'ValidationException';
    // Set the prototype explicitly.
    // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, ValidationException.prototype);
  }
}
