// src/validation/user.validation.ts

import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['SUPERADMIN', 'ADMIN', 'TEACHER']).optional(),
});

export const updateUserRoleSchema = z.object({
  role: z.enum(['SUPERADMIN', 'ADMIN', 'TEACHER']),
});
