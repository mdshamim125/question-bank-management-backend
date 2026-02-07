import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { QuestionService } from './question.service';
import catchAsync from '../../utils/catchAsync';
import AppError from '../../errors/AppError';
import { ITokenUser } from '../../interface/auth.interface';
import { QuestionFilters, QuestionTypeEnum } from './question.interface';

// CREATE QUESTION
const createQuestion = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as ITokenUser; // ensure user is attached by auth middleware
  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not authenticated');
  }

  const result = await QuestionService.createQuestion(req.body, user);

  res.status(httpStatus.CREATED).json({
    success: true,
    message: 'Question created successfully',
    data: result,
  });
});

// UPDATE QUESTION
const updateQuestion = catchAsync(async (req: Request, res: Response) => {
  const user = req.user as ITokenUser;
  const questionId = Number(req.params.id);

  if (!questionId) {
    throw new AppError(httpStatus.BAD_REQUEST, 'questionId is required');
  }

  const result = await QuestionService.updateQuestion(
    questionId,
    req.body,
    user,
  );

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Question updated successfully',
    data: result,
  });
});

// GET QUESTIONS BY CLASS, SUBJECT, CHAPTER AND TYPE
const getQuestionsBySubjectAndChapter = catchAsync(
  async (req: Request, res: Response) => {
    const classId = Number(req.query.classId);
    const subjectId = Number(req.query.subjectId);
    const chapterId = Number(req.query.chapterId);
    const type = req.query.type as string; // optional, e.g., OBJECTIVE, ANAHOTE, SRIJONSHIL

    // Validate required IDs
    if (!classId || !subjectId || !chapterId) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'classId, subjectId, and chapterId are required',
      );
    }

    const result = await QuestionService.getQuestionsByClassSubjectChapter(
      classId,
      subjectId,
      chapterId,
      type,
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Questions retrieved successfully',
      data: result,
    });
  },
);

// DELETE QUESTION
const deleteQuestion = catchAsync(async (req: Request, res: Response) => {
  const questionId = Number(req.params.id);

  if (!questionId) {
    throw new Error('Question id is required');
  }

  const result = await QuestionService.deleteQuestion(questionId, req.user!);

  res.status(httpStatus.OK).json({
    success: true,
    message: 'Question deleted successfully',
    data: result,
  });
});

const getAllQuestionsWithFiltering = catchAsync(
  async (req: Request, res: Response) => {
    const filters = {
      classId: req.query.classId ? Number(req.query.classId) : undefined,
      subjectId: req.query.subjectId ? Number(req.query.subjectId) : undefined,
      chapterId: req.query.chapterId ? Number(req.query.chapterId) : undefined,
      type: req.query.type as string | undefined,
    };

    const result = await QuestionService.getAllQuestionsWithFiltering(filters);

    res.status(httpStatus.OK).json({
      success: true,
      message: 'Questions retrieved successfully',
      data: result,
    });
  },
);

const getAllQuestionsFromDBWithPagination = catchAsync(async (req, res) => {
  const filters: QuestionFilters = {
    classId: req.query.classId ? Number(req.query.classId) : undefined,
    subjectId: req.query.subjectId ? Number(req.query.subjectId) : undefined,
    chapterId: req.query.chapterId ? Number(req.query.chapterId) : undefined,
    type: req.query.type as QuestionTypeEnum | undefined, // ✅ FIX
    search: req.query.search as string | undefined,
  };

  const options = {
    page: req.query.page,
    limit: req.query.limit,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder,
  };

  const result = await QuestionService.getAllQuestionsFromDBWithPagination(
    filters,
    options,
  );

  res.status(200).json({
    success: true,
    message: 'Questions fetched successfully',
    meta: result.meta,
    data: result.data,
  });
});

const getQuestionById = catchAsync(async (req, res) => {
  const id = Number(req.params.id);

  if (!id) {
    throw new AppError(400, 'Question ID is required');
  }

  const result = await QuestionService.getQuestionByIdFromDB(id);

  if (!result) {
    throw new AppError(404, 'Question not found');
  }

  res.status(200).json({
    success: true,
    message: 'Question fetched successfully',
    data: result,
  });
});

export const QuestionController = {
  createQuestion,
  getQuestionsBySubjectAndChapter,
  updateQuestion,
  getAllQuestionsWithFiltering,
  getAllQuestionsFromDBWithPagination,
  deleteQuestion,
  getQuestionById,
};
