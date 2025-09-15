import { getEnv } from '../utils/get-env';

export const Env = {
  PORT: getEnv('PORT'),
  NODE_ENV: getEnv('NODE_ENV'),
  JWT_SECRET: getEnv('JWT_SECRET'),
  COOKIE_NAME: getEnv('COOKIE_NAME'),
  REDIS_URL: getEnv('REDIS_URL'),
};
