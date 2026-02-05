// src/validation/teacherSubject.validation.ts

import { z } from 'zod';

export const assignTeacherSchema = z.object({
  teacherId: z.number({ invalid_type_error: 'teacherId must be a number' }),
  subjectId: z.number({ invalid_type_error: 'subjectId must be a number' }),
});
