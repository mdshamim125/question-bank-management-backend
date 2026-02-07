// questionHeader.validation.ts
import { z } from 'zod';

export const createQuestionHeaderSchema = z.object({
  schoolName: z.string().min(1, 'School name is required'),
  location: z.string().min(1, 'Location is required'),
  className: z.string().min(1, 'Class name is required'),
  subject: z.string().min(1, 'Subject is required'),
  examType: z.string().min(1, 'Exam type is required'),
  duration: z.string().min(1, 'Duration is required'),
  fullMark: z.number().positive('Full mark must be positive'),
  remark: z.string().optional(),
});

export const updateQuestionHeaderSchema = z.object({
  schoolName: z.string().optional(),
  location: z.string().optional(),
  className: z.string().optional(),
  subject: z.string().optional(),
  examType: z.string().optional(),
  duration: z.string().optional(),
  fullMark: z.number().positive().optional(),
  remark: z.string().optional(),
});
