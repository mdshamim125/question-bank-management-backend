import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { QuestionController } from './question.controller';
import auth from '../../middlewares/auth';
import { createQuestionSchema } from './question.validation';
import multer from 'multer';

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post(
  '/',
  auth('TEACHER', 'ADMIN', 'SUPERADMIN'),
  validateRequest(createQuestionSchema),
  QuestionController.createQuestion,
);


// GET questions by class, subject, and chapter
// router.get(
//   '/',
//   auth('TEACHER', 'ADMIN', 'SUPERADMIN'),
//   QuestionController.getQuestionsBySubjectAndChapter, // Handles classId, subjectId, chapterId via query params
// );

// router.get(
//   '/',
//   auth('TEACHER', 'ADMIN', 'SUPERADMIN'),
//   QuestionController.getAllQuestionsWithFiltering, // Handles classId, subjectId, chapterId via query params
// );

router.get(
  '/',
  auth('TEACHER', 'ADMIN', 'SUPERADMIN'),
  QuestionController.getAllQuestionsFromDBWithPagination, // Handles pagination and filtering
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

router.get(
  '/:id',
  auth('TEACHER', 'ADMIN', 'SUPERADMIN'),
  QuestionController.getQuestionById,
);

// ─── UPLOAD GENERATED PDF / DOCX ─────────────────────────────────────────
router.post(
  '/question-papers',
  auth('TEACHER', 'ADMIN', 'SUPERADMIN'),
  upload.single('file'),
  QuestionController.uploadGeneratedPaper, // New controller method
);

export const QuestionRoutes = router;
