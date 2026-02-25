import express from 'express';
import auth from '../../middlewares/auth';
import { QuestionPaperController } from './quesionPaper.controller';

const router = express.Router();

// Create Question Paper
router.post(
  '/',
  auth('TEACHER', 'ADMIN', 'SUPERADMIN'),
  QuestionPaperController.createOneQuestionPaper,
);

// Get all papers (optional)
router.get(
  '/',
  auth('TEACHER', 'ADMIN', 'SUPERADMIN'),
  QuestionPaperController.getAllQuestionPapers,
);

export const QuestionPaperRoutes = router;
