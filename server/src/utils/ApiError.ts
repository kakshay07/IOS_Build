import { Request, Response, NextFunction } from 'express';


class ApiError extends Error {
    public statusCode: number;
    public data: any;
    public success: boolean;
    public errors: any[];

    constructor(
        statusCode: number,
        message: string = 'Something went wrong',
        errors: any[] = [],
        stack: string = ''
    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };

/**
 * Example usage of the ApiError class:
 *
 * const err = new ApiError(404, 'Resource not found', [], '');
 * throw err;
 */

// Example of how to use the errorHandler middleware:
// app.use(errorHandler);
