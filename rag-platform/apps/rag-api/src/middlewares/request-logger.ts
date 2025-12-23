import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import { v4 as uuidv4 } from 'uuid';

declare global {
    namespace Express {
        interface Request {
            requestId: string;
            startTime: number;
        }
    }
}

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    req.requestId = uuidv4();
    req.startTime = Date.now();

    // Log incoming request
    logger.info({
        requestId: req.requestId,
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('user-agent'),
    }, 'Incoming request');

    // Log response on finish
    res.on('finish', () => {
        const duration = Date.now() - req.startTime;

        logger.info({
            requestId: req.requestId,
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
        }, 'Request completed');
    });

    next();
};
