import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    err: Error | AppError,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            error: err.message
        });
        return;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        res.status(400).json({
            error: 'Validation error',
            details: err.message
        });
        return;
    }

    // Mongoose duplicate key error
    if (err.name === 'MongoServerError' && (err as any).code === 11000) {
        res.status(409).json({
            error: 'Duplicate entry'
        });
        return;
    }

    // Multer file upload errors
    if (err.name === 'MulterError') {
        const multerErr = err as any;
        if (multerErr.code === 'LIMIT_FILE_SIZE') {
            res.status(400).json({
                error: 'File too large'
            });
            return;
        }
    }

    // Default error
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error'
    });
};

export const notFound = (_req: Request, res: Response): void => {
    res.status(404).json({
        error: 'Route not found'
    });
};
