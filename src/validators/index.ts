import { z } from 'zod';

// Name schema
export const nameSchema = z
  .string('Name is required')
  .trim()
  .min(2, { message: 'Name must be at least 2 characters' })
  .max(100, { message: 'Name must be under 100 characters' });

// Email schema
export const emailSchema = z
  .string('Email is required')
  .trim()
  .min(1, { message: 'Email cannot be empty' })
  .email('Please enter a valid email address');

// Password schema
export const passwordSchema = z
  .string('Password is required')
  .trim()
  .min(8, { message: 'Password must be at least 8 characters' })
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[@$!%*?&#]/, 'Password must contain at least one special character');

export const questionSchema = z
  .string('Question is required')
  .min(1, 'Question must be at least 1 charactor long')
  .trim();

export const optionSchema = z
  .string('Option text is required')
  .min(1, 'Option must be at least 1 character long')
  .trim();
