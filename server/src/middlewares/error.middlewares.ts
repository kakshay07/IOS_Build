import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { removeUnusedMulterImageFilesOnError } from '../utils';

/**
 *
 * @param {Error | ApiError} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 *
 *
 * @description This middleware is responsible for catching errors from any request handler wrapped inside the {@link asyncHandler}
 */
const errorHandler = (err: Error | ApiError, req: Request, res: Response, next: NextFunction) => {
    let error = err;

    if (!(error instanceof ApiError)) {
        error = new ApiError(500, err.message || 'Something went wrong');
    }

    const response = {
        statusCode: (error as ApiError).statusCode,
        message: error.message,
        ...(process.env.NODE_ENV === 'development'
            ? { stack: error.stack }
            : {}),
    };

    removeUnusedMulterImageFilesOnError(req);

    return res.status((error as ApiError).statusCode).json(response);
};

export { errorHandler };
