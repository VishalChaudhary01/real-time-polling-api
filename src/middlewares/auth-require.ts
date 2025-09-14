import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getCookie } from '../utils/cookie';
import { AppError } from '../utils/app-error';
import { HttpStatus } from '../config/http.config';
import { Env } from '../config/env.config';

export async function authRequire(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    const token = getCookie(req);
    if (!token) {
      throw new AppError('Token not found', HttpStatus.UNAUTHORIZED);
    }

    const payload = jwt.verify(token, Env.JWT_SECRET) as { userId: string };
    if (!payload || !payload.userId) {
      throw new AppError('Invalid or expired token', HttpStatus.UNAUTHORIZED);
    }

    req.userId = payload.userId;
    next();
  } catch (error) {
    next(error);
  }
}
