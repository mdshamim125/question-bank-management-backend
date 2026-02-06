import { z } from 'zod';

export const createQuestionSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('OBJECTIVE'),
    classId: z.number(), // added
    subjectId: z.number(),
    chapterId: z.number(), // added
    questionText: z.string(),
    options: z.array(z.string()).length(4),
    answerOptionIndex: z.number().min(0).max(3),
  }),

  z.object({
    type: z.literal('ANAHOTE'),
    classId: z.number(), // added
    subjectId: z.number(),
    chapterId: z.number(), // added
    questionText: z.string(),
  }),

  z.object({
    type: z.literal('SRIJONSHIL'),
    classId: z.number(), // added
    subjectId: z.number(),
    chapterId: z.number(), // added
    prompt: z.string(),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),
    subQuestions: z.array(
      z.object({
        questionText: z.string(),
        hint: z.string().optional(),
      }),
    ),
  }),
]);
