// src/modules/chapter/chapter.validation.ts

import { z } from 'zod';

export const createChapterSchema = z.object({
  name: z.string().min(1, 'Chapter name is required'),
  classId: z.number().int().positive(),
  subjectId: z.number().int().positive(),
});

export const updateChapterSchema = z.object({
  name: z.string().min(1).optional(),
});
