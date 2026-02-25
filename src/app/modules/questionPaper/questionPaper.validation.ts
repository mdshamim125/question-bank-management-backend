import { z } from 'zod';

export const createQuestionPaperSchema = z.object({
  body: z.object({
    title: z.string(),
    headerId: z.number().optional(),
    questions: z.array(
      z.object({
        questionId: z.number(),
        order: z.number(),
        customMark: z.number().optional(),
      }),
    ),
  }),
});
