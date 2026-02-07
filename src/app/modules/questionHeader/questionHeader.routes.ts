// questionHeader.routes.ts
import { Router } from 'express';
import * as QuestionHeaderController from './questionHeader.controller';
import { createQuestionHeaderSchema, updateQuestionHeaderSchema } from './questionHeader.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = Router();

router.post(
  '/',
  validateRequest(createQuestionHeaderSchema),
  QuestionHeaderController.createHeader,
);

router.get('/', QuestionHeaderController.getAllHeaders);
router.get('/:id', QuestionHeaderController.getHeaderById);

router.patch(
  '/:id',
  validateRequest(updateQuestionHeaderSchema),
  QuestionHeaderController.updateHeader,
);

router.delete('/:id', QuestionHeaderController.deleteHeader);

export const QuestionHeaderRoutes = router;
