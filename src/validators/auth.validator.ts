import z from 'zod';
import { emailSchema, nameSchema, passwordSchema } from '.';

export const signupSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const signinSchema = z.object({
  email: emailSchema,
  password: z
    .string('Password is required')
    .min(2, 'Password must db at least 2 charactor long'),
});

export type SignupDto = z.infer<typeof signupSchema>;
export type SigninDto = z.infer<typeof signinSchema>;
