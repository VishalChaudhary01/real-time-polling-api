import { Request, Response } from 'express';
import { prisma } from '../config/db.config';
import { AppError } from '../utils/app-error';
import { HttpStatus } from '../config/http.config';

export const getProfile = async (req: Request, res: Response) => {
  const userId = req.userId ?? '';
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    throw new AppError('User not found', HttpStatus.NOT_FOUND);
  }

  res.status(HttpStatus.OK).json({
    message: 'Get Profile successful',
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  });
};
