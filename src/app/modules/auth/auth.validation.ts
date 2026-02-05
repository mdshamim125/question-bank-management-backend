// src/validation/auth.validation.ts

import { z } from 'zod';
import { UserRoleEnum } from '@prisma/client';

// -----------------
// REGISTER VALIDATION
// -----------------
export const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' })
    .max(50, { message: 'Name must be less than 50 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
  role: z
    .enum([UserRoleEnum.SUPERADMIN, UserRoleEnum.ADMIN, UserRoleEnum.TEACHER])
    .optional(),
});

// -----------------
// LOGIN VALIDATION
// -----------------
export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters.' }),
});
