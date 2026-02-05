// src/validation/subject.validation.ts

import { z } from 'zod';

export const createSubjectSchema = z.object({
  name: z.string().min(2, { message: 'Subject name must be at least 2 characters.' }),
  classId: z.number({ invalid_type_error: 'classId must be a number' }),
});

export const updateSubjectSchema = z.object({
  name: z.string().min(2).optional(),
  classId: z.number().optional(),
});
