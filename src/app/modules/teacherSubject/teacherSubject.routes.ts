// src/routes/teacherSubject.routes.ts

import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { assignTeacherSchema } from './teacherSubject.validation';
import { TeacherSubjectController } from './teacherSubject.controller';

const router = Router();

// ASSIGN TEACHER TO SUBJECT
router.post(
  '/',
  validateRequest(assignTeacherSchema),
  TeacherSubjectController.assignTeacher,
);

// GET ALL ASSIGNMENTS
router.get('/', TeacherSubjectController.getAllAssignments);

// REMOVE TEACHER FROM SUBJECT
router.delete(
  '/:teacherId/:subjectId',
  TeacherSubjectController.removeAssignment,
);

// GET TEACHER'S SUBJECTS BY TEACHER ID
router.get(
  '/teacher/:teacherId',
  TeacherSubjectController.getTeacherSubjectsByTeacherId,
);

export const TeacherSubjectRoutes = router;
