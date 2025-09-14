import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function inputValidator(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}
