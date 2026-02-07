import { z } from 'zod';

/* ================= CREATE QUESTION ================= */

export const createQuestionSchema = z.discriminatedUnion('type', [
  // ================= OBJECTIVE =================
  z.object({
    type: z.literal('OBJECTIVE'),
    classId: z.number(),
    subjectId: z.number(),
    chapterId: z.number(),

    questionText: z.string().min(1),
    questionMark: z.number().positive(), // ✅ added

    options: z.array(z.string()).length(4),
    answerOptionIndex: z.number().min(0).max(3),
  }),

  // ================= ANAHOTE =================
  z.object({
    type: z.literal('ANAHOTE'),
    classId: z.number(),
    subjectId: z.number(),
    chapterId: z.number(),

    questionText: z.string().min(1),
    questionMark: z.number().positive(), // ✅ added
  }),

  // ================= SRIJONSHIL =================
  z.object({
    type: z.literal('SRIJONSHIL'),
    classId: z.number(),
    subjectId: z.number(),
    chapterId: z.number(),

    prompt: z.string().min(1),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']),

    subQuestions: z.array(
      z.object({
        questionText: z.string().min(1),
        questionMark: z.number().positive(), // ✅ added
        hint: z.string().optional(),
      }),
    ),
  }),
]);

/* ================= UPDATE QUESTION ================= */

export const updateQuestionSchema = z.discriminatedUnion('type', [
  // ================= OBJECTIVE UPDATE =================
  z.object({
    type: z.literal('OBJECTIVE'),

    classId: z.number().optional(),
    subjectId: z.number().optional(),
    chapterId: z.number().optional(),

    questionText: z.string().optional(),
    questionMark: z.number().positive().optional(), // ✅ added
    options: z.array(z.string()).length(4).optional(),
    answerOptionIndex: z.number().min(0).max(3).optional(),
  }),

  // ================= ANAHOTE UPDATE =================
  z.object({
    type: z.literal('ANAHOTE'),

    classId: z.number().optional(),
    subjectId: z.number().optional(),
    chapterId: z.number().optional(),

    questionText: z.string().optional(),
    questionMark: z.number().positive().optional(), // ✅ added
  }),

  // ================= SRIJONSHIL UPDATE =================
  z.object({
    type: z.literal('SRIJONSHIL'),

    classId: z.number().optional(),
    subjectId: z.number().optional(),
    chapterId: z.number().optional(),

    prompt: z.string().optional(),
    difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),

    subQuestions: z
      .array(
        z.object({
          questionText: z.string().optional(),
          questionMark: z.number().positive().optional(), // ✅ added
          hint: z.string().optional(),
        }),
      )
      .optional(),
  }),
]);
