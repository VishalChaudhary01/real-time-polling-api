import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Env } from '../config/env.config';
import { prisma } from '../config/db.config';
import { HttpStatus } from '../config/http.config';
import { AppError } from '../utils/app-error';
import { clearCookie, setCookie } from '../utils/cookie';
import { SigninDto, SignupDto } from '../validators/auth.validator';

export async function signup(req: Request, res: Response) {
  const data: SignupDto = req.body;
  const existUser = await prisma.user.findFirst({
    where: { email: data.email },
  });
  if (existUser) {
    throw new AppError(
      'Email is already registered, Try to Signin',
      HttpStatus.BAD_REQUEST
    );
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);
  const user = await prisma.user.create({
    data: {
      ...data,
      password: hashedPassword,
    },
  });

  const token = jwt.sign({ userId: user.id }, Env.JWT_SECRET, {
    expiresIn: '1h',
  });

  setCookie(res, token)
    .status(HttpStatus.CREATED)
    .json({ message: 'Signup successful' });
}

export async function signin(req: Request, res: Response) {
  const data: SigninDto = req.body;

  const user = await prisma.user.findFirst({
    where: { email: data.email },
  });
  if (!user) {
    throw new AppError('Invalid eamil or password', HttpStatus.BAD_REQUEST);
  }

  const matchPassword = await bcrypt.compare(data.password, user.password);
  if (!matchPassword) {
    throw new AppError('Invalid eamil or password', HttpStatus.BAD_REQUEST);
  }

  const token = jwt.sign({ userId: user.id }, Env.JWT_SECRET, {
    expiresIn: '1h',
  });

  setCookie(res, token)
    .status(HttpStatus.CREATED)
    .json({ message: 'Signin successful' });
}

export async function signout(_req: Request, res: Response) {
  clearCookie(res).status(HttpStatus.OK).json({
    message: 'Logout successful',
  });
}
