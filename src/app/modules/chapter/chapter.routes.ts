// src/modules/chapter/chapter.routes.ts

import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import {
  createChapterSchema,
  updateChapterSchema,
} from './chapter.validation';
import { ChapterController } from './chapter.controller';

const router = Router();

router.post(
  '/',
  validateRequest(createChapterSchema),
  ChapterController.createChapter,
);

router.get('/', ChapterController.getAllChapters);
router.get('/:id', ChapterController.getChapterById);

router.patch(
  '/:id',
  validateRequest(updateChapterSchema),
  ChapterController.updateChapter,
);

router.delete('/:id', ChapterController.deleteChapter);

export const ChapterRoutes = router;
