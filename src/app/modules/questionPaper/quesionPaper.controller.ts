import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { QuestionPaperService } from './quesionPaper.service';

const createOneQuestionPaper = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user; // from auth middleware
console.log(req.body);
    const result = await QuestionPaperService.createOneQuestionPaper(
      req.body,
      user,
    );

    res.status(201).json({
      success: true,
      message: 'Question paper created successfully',
      data: result,
    });
  },
);

const getAllQuestionPapers = catchAsync(async (req: Request, res: Response) => {
  const result = await QuestionPaperService.getAllQuestionPapers();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Question papers retrieved',
    data: result,
  });
});

export const QuestionPaperController = {
  createOneQuestionPaper,
  getAllQuestionPapers,
};
