import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';

export interface AppError extends Error {
    statusCode?: number;
    code?: string;
}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.statusCode ?? 500;
    const message = statusCode === 500 ? 'Internal server error' : err.message;

    logger.error({
        err: {
            message: err.message,
            stack: err.stack,
            code: err.code,
        },
        req: {
            method: req.method,
            url: req.url,
            ip: req.ip,
        },
    }, 'Request error');

    res.status(statusCode).json({
        error: message,
        code: err.code,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export const createError = (message: string, statusCode: number, code?: string): AppError => {
    const error: AppError = new Error(message);
    error.statusCode = statusCode;
    error.code = code;
    return error;
};
