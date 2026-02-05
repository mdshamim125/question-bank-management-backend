// src/routes/subject.routes.ts

import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { createSubjectSchema, updateSubjectSchema } from './subject.validation';
import { SubjectController } from './subject.controller';

const router = Router();

// CRUD ROUTES
router.post(
  '/',
  validateRequest(createSubjectSchema),
  SubjectController.createSubject,
);
router.get('/', SubjectController.getAllSubjects);
router.get('/:id', SubjectController.getSubjectById);
router.patch(
  '/:id',
  validateRequest(updateSubjectSchema),
  SubjectController.updateSubject,
);
router.delete('/:id', SubjectController.deleteSubject);

export const SubjectRoutes = router;
