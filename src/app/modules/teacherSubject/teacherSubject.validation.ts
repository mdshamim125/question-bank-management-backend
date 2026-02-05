// src/validation/teacherSubject.validation.ts

import { z } from 'zod';

export const assignTeacherSchema = z.object({
  teacherId: z
    .number({ invalid_type_error: 'teacherId must be a number' })
    .int('teacherId must be an integer')
    .positive('teacherId must be positive'),

  subjectId: z
    .number({ invalid_type_error: 'subjectId must be a number' })
    .int('subjectId must be an integer')
    .positive('subjectId must be positive'),

  classId: z
    .number({ invalid_type_error: 'classId must be a number' })
    .int('classId must be an integer')
    .positive('classId must be positive'),
});
