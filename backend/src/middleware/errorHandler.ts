import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err && err.code) {
    switch (err.code) {
      case 'P2002':
        return res.status(409).json({
          success: false,
          message: 'A record with this value already exists',
        });
      case 'P2025':
        return res.status(404).json({
          success: false,
          message: 'Record not found',
        });
      case 'P2003':
        return res.status(400).json({
          success: false,
          message: 'Foreign key constraint failed',
        });
      default:
        return res.status(400).json({
          success: false,
          message: 'Database error',
        });
    }
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message,
  });
};