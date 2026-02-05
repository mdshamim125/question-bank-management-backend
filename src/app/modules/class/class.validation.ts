// src/validation/class.validation.ts

import { z } from 'zod';

export const createClassSchema = z.object({
  name: z.string().min(2, { message: 'Class name must be at least 2 characters.' }),
});

export const updateClassSchema = z.object({
  name: z.string().min(2).optional(),
});
