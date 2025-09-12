import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../config/http.config';
import { AppError } from '../utils/app-error';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  console.log(`Error occure at PATH: ${req.path}`, error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    message: error?.message ?? 'Internal server occure',
  });
}
