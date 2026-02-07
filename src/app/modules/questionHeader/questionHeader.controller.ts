// questionHeader.controller.ts
import { Request, Response } from 'express';
import * as QuestionHeaderService from './questionHeader.service';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';

export const createHeader = catchAsync(async (req: Request, res: Response) => {
  const result = await QuestionHeaderService.createQuestionHeader(req.body);
  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Question header created successfully',
    data: result,
  });
});

export const updateHeader = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await QuestionHeaderService.updateQuestionHeader(id, req.body);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Question header updated successfully',
    data: result,
  });
});

export const getAllHeaders = catchAsync(async (req: Request, res: Response) => {
  const result = await QuestionHeaderService.getQuestionHeaders();
  res.status(httpStatus.OK).json({
    success: true,
    data: result,
  });
});

export const getHeaderById = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await QuestionHeaderService.getQuestionHeaderById(id);
  res.status(httpStatus.OK).json({
    success: true,
    data: result,
  });
});

export const deleteHeader = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await QuestionHeaderService.deleteQuestionHeader(id);
  res.status(httpStatus.OK).json({
    success: true,
    message: 'Question header deleted successfully',
  });
});
