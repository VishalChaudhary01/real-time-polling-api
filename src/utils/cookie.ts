import { Request, Response } from 'express';
import { Env } from '../config/env.config';

export function setCookie(res: Response, token: string) {
  return res.cookie(Env.COOKIE_NAME, token, {
    httpOnly: true,
    secure: Env.NODE_ENV === 'production',
    sameSite: Env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 60 * 60 * 1000,
    path: '/',
  });
}

export function getCookie(req: Request) {
  return req.cookies[Env.COOKIE_NAME] ?? null;
}

export function clearCookie(res: Response) {
  return res.clearCookie(Env.COOKIE_NAME);
}
