import z from 'zod';
import { optionSchema, questionSchema } from '.';

export const createPollSchema = z.object({
  question: questionSchema,
  isPublished: z.boolean().optional(),
  options: z
    .array(
      z.object({
        text: optionSchema,
      }),
      'Options is required'
    )
    .min(2, 'Poll must have at least 2 options'),
});

export type CreatePollDto = z.infer<typeof createPollSchema>;
