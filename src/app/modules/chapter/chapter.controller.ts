// src/modules/chapter/chapter.controller.ts

import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { ChapterService } from './chapter.service';

const createChapter = catchAsync(async (req: Request, res: Response) => {
  const result = await ChapterService.createChapter(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Chapter created successfully',
    data: result,
  });
});

const getAllChapters = catchAsync(async (_req: Request, res: Response) => {
  const result = await ChapterService.getAllChapters();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Chapters retrieved successfully',
    data: result,
  });
});

const getChapterById = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await ChapterService.getChapterById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Chapter retrieved successfully',
    data: result,
  });
});

const updateChapter = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await ChapterService.updateChapter(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Chapter updated successfully',
    data: result,
  });
});

const deleteChapter = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await ChapterService.deleteChapter(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Chapter deleted successfully',
    data: result,
  });
});

export const ChapterController = {
  createChapter,
  getAllChapters,
  getChapterById,
  updateChapter,
  deleteChapter,
};
