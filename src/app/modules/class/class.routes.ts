// src/routes/class.routes.ts

import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { createClassSchema, updateClassSchema } from './class.validation';
import { ClassController } from './class.controller';

const router = Router();

// CRUD ROUTES
router.post(
  '/',
  validateRequest(createClassSchema),
  ClassController.createClass,
);
router.get('/', ClassController.getAllClasses);
router.get('/:id', ClassController.getClassById);
router.patch(
  '/:id',
  validateRequest(updateClassSchema),
  ClassController.updateClass,
);
router.delete('/:id', ClassController.deleteClass);

export const ClassRoutes = router;
