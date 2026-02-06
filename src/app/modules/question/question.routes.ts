import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { QuestionController } from './question.controller';
import auth from '../../middlewares/auth';
import { createQuestionSchema } from './question.validation';

const router = express.Router();

router.post(
  '/',
  auth('TEACHER', 'ADMIN', 'SUPERADMIN'),
  validateRequest(createQuestionSchema),
  QuestionController.createQuestion,
);

// GET questions by class, subject, and chapter
router.get(
  '/',
  auth('TEACHER', 'ADMIN', 'SUPERADMIN'),
  QuestionController.getQuestionsBySubjectAndChapter, // Handles classId, subjectId, chapterId via query params
);

// =====================
router.patch(
  '/:id',
  auth('TEACHER', 'ADMIN', 'SUPERADMIN'),
  // validateRequest(updateQuestionSchema),
  QuestionController.updateQuestion,
);

// DELETE QUESTION
router.delete(
  '/:id',
  auth('TEACHER', 'ADMIN', 'SUPERADMIN'),
  QuestionController.deleteQuestion,
);

export const QuestionRoutes = router;
