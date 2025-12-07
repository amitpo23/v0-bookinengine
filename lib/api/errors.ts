/**
 * Custom error classes for structured error handling
 */

// HTTP Status Code Constants
const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  PAYMENT_REQUIRED: 402,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
} as const;

/**
 * Base API Error class
 */
export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    code = 'INTERNAL_ERROR',
    isOperational = true
  ) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Validation Error - 400
 */
export class ValidationError extends ApiError {
  constructor(message: string, code = 'VALIDATION_ERROR') {
    super(message, HTTP_STATUS.BAD_REQUEST, code);
    this.name = 'ValidationError';
  }
}

/**
 * Authentication Error - 401
 */
export class AuthenticationError extends ApiError {
  constructor(
    message = 'Authentication required',
    code = 'AUTHENTICATION_ERROR'
  ) {
    super(message, HTTP_STATUS.UNAUTHORIZED, code);
    this.name = 'AuthenticationError';
  }
}

/**
 * Authorization Error - 403
 */
export class AuthorizationError extends ApiError {
  constructor(message = 'Access forbidden', code = 'AUTHORIZATION_ERROR') {
    super(message, HTTP_STATUS.FORBIDDEN, code);
    this.name = 'AuthorizationError';
  }
}

/**
 * Not Found Error - 404
 */
export class NotFoundError extends ApiError {
  constructor(message = 'Resource not found', code = 'NOT_FOUND') {
    super(message, HTTP_STATUS.NOT_FOUND, code);
    this.name = 'NotFoundError';
  }
}

/**
 * Conflict Error - 409
 */
export class ConflictError extends ApiError {
  constructor(message: string, code = 'CONFLICT_ERROR') {
    super(message, HTTP_STATUS.CONFLICT, code);
    this.name = 'ConflictError';
  }
}

/**
 * Rate Limit Error - 429
 */
export class RateLimitError extends ApiError {
  constructor(message = 'Too many requests', code = 'RATE_LIMIT_ERROR') {
    super(message, HTTP_STATUS.TOO_MANY_REQUESTS, code);
    this.name = 'RateLimitError';
  }
}

/**
 * External Service Error - 502
 */
export class ExternalServiceError extends ApiError {
  constructor(
    message = 'External service unavailable',
    code = 'EXTERNAL_SERVICE_ERROR'
  ) {
    super(message, HTTP_STATUS.BAD_GATEWAY, code);
    this.name = 'ExternalServiceError';
  }
}

/**
 * Service Unavailable Error - 503
 */
export class ServiceUnavailableError extends ApiError {
  constructor(
    message = 'Service temporarily unavailable',
    code = 'SERVICE_UNAVAILABLE'
  ) {
    super(message, HTTP_STATUS.SERVICE_UNAVAILABLE, code);
    this.name = 'ServiceUnavailableError';
  }
}

/**
 * Hotel-specific errors
 */
export class HotelNotAvailableError extends ApiError {
  constructor(message = 'Hotel is not available for selected dates') {
    super(message, HTTP_STATUS.BAD_REQUEST, 'HOTEL_NOT_AVAILABLE');
    this.name = 'HotelNotAvailableError';
  }
}

export class BookingError extends ApiError {
  constructor(message: string, code = 'BOOKING_ERROR') {
    super(message, HTTP_STATUS.BAD_REQUEST, code);
    this.name = 'BookingError';
  }
}

export class PaymentError extends ApiError {
  constructor(message: string, code = 'PAYMENT_ERROR') {
    super(message, HTTP_STATUS.PAYMENT_REQUIRED, code);
    this.name = 'PaymentError';
  }
}

/**
 * Error handler utility
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Format error for API response
 */
export function formatErrorResponse(error: unknown) {
  if (isApiError(error)) {
    return {
      error: {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
      },
    };
  }

  // Return generic error for unexpected errors
  return {
    error: {
      message: 'An unexpected error occurred',
      code: 'INTERNAL_ERROR',
      statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    },
  };
}

/**
 * Handle error in API route
 */
export function handleApiError(error: unknown) {
  const errorResponse = formatErrorResponse(error);

  return new Response(JSON.stringify(errorResponse), {
    status: errorResponse.error.statusCode,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
