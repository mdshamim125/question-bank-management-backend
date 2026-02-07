import prisma from '../../utils/prisma';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import {
  ICreateQuestion,
  IUpdateQuestion,
  QuestionFilters,
} from './question.interface';
import { ITokenUser } from '../../interface/auth.interface';
import { calculatePagination } from '../../utils/calculatePagination';

const createQuestion = async (payload: ICreateQuestion, user: ITokenUser) => {
  // ✅ Only check assignment if role is TEACHER
  if (user.role === 'TEACHER') {
    const assigned = await prisma.teacherSubject.findFirst({
      where: {
        teacherId: user.id as number,
        subjectId: payload.subjectId,
        classId: payload.classId,
      },
    });

    if (!assigned) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'Teacher is not assigned to this class and subject',
      );
    }
  }

  // Use transaction for all question types
  return prisma.$transaction(async tx => {
    // 1️⃣ Create root question
    const question = await tx.question.create({
      data: {
        type: payload.type,
        subjectId: payload.subjectId,
        classId: payload.classId,
        chapterId: payload.chapterId,
        createdById: user.id as number,
      },
    });

    // 2️⃣ OBJECTIVE
    if (payload.type === 'OBJECTIVE') {
      const objective = await tx.objectiveQuestion.create({
        data: {
          questionId: question.id,
          questionText: payload.questionText,
          questionMark: payload.questionMark,
          answerOptionId: 0, // temporary, updated later
        },
      });

      // Create options
      await tx.option.createMany({
        data: payload.options.map(text => ({
          text,
          objectiveQuestionId: objective.id,
        })),
      });

      // Fetch all options to set correct answer
      const options = await tx.option.findMany({
        where: { objectiveQuestionId: objective.id },
        orderBy: { id: 'asc' },
      });

      // Update correct answer
      await tx.objectiveQuestion.update({
        where: { id: objective.id },
        data: { answerOptionId: options[payload.answerOptionIndex].id },
      });

      return { question, objective, options };
    }

    // 3️⃣ ANAHOTE
    if (payload.type === 'ANAHOTE') {
      const anahote = await tx.anahoteQuestion.create({
        data: {
          questionId: question.id,
          questionText: payload.questionText,
          questionMark: payload.questionMark,
        },
      });

      return { question, anahote };
    }

    // 4️⃣ SRIJONSHIL
    if (payload.type === 'SRIJONSHIL') {
      // const srijonshil = await tx.srijonshilQuestion.create({
      //   data: {
      //     questionId: question.id,
      //     prompt: payload.prompt,
      //     difficulty: payload.difficulty,
      //     subQuestions: { create: payload.subQuestions },
      //   },
      //   include: { subQuestions: true },
      // });
      const srijonshil = await tx.srijonshilQuestion.create({
        data: {
          questionId: question.id,
          prompt: payload.prompt,
          difficulty: payload.difficulty,
          subQuestions: {
            create: payload.subQuestions.map(sq => ({
              questionText: sq.questionText,
              questionMark: sq.questionMark, // ✅ ADD
              hint: sq.hint,
            })),
          },
        },
        include: { subQuestions: true },
      });

      return { question, srijonshil };
    }

    throw new AppError(httpStatus.BAD_REQUEST, 'Unsupported question type');
  });
};

// UPDATE QUESTION

const updateQuestion = async (
  questionId: number,
  payload: IUpdateQuestion,
  user: ITokenUser,
) => {
  const existing = await prisma.question.findUnique({
    where: { id: questionId },
  });

  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, 'Question not found');
  }

  // Teacher permission check
  if (user.role === 'TEACHER') {
    const assigned = await prisma.teacherSubject.findFirst({
      where: {
        teacherId: user.id as number,
        subjectId: existing.subjectId!,
        classId: existing.classId!,
      },
    });

    if (!assigned) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'Teacher is not assigned to this class and subject',
      );
    }
  }

  return prisma.$transaction(async tx => {
    const data: any = {};

    if (payload.type) data.type = payload.type;

    if (payload.subjectId)
      data.subject = { connect: { id: payload.subjectId } };

    if (payload.chapterId)
      data.chapter = { connect: { id: payload.chapterId } };

    if (payload.classId) data.class = { connect: { id: payload.classId } };

    /* ---------- TYPE-SAFE UPDATES ---------- */

    if (payload.type === 'OBJECTIVE') {
      data.objective = {
        update: {
          ...(payload.questionText && { questionText: payload.questionText }),
          ...(payload.questionMark && { questionMark: payload.questionMark }), // ✅
        },
      };
    }

    if (payload.type === 'ANAHOTE') {
      data.anahote = {
        update: {
          ...(payload.questionText && { questionText: payload.questionText }),
          ...(payload.questionMark && { questionMark: payload.questionMark }), // ✅
        },
      };
    }

    if (payload.type === 'SRIJONSHIL' && payload.subQuestions) {
      const srijonshil = await tx.srijonshilQuestion.findUnique({
        where: { questionId },
      });

      await tx.subQuestion.deleteMany({
        where: { srijonshilQuestionId: srijonshil!.id },
      });

      await tx.subQuestion.createMany({
        data: payload.subQuestions.map(sq => ({
          srijonshilQuestionId: srijonshil!.id,
          questionText: sq.questionText!,
          questionMark: sq.questionMark,
          hint: sq.hint,
        })),
      });
    }

    const updatedQuestion = await tx.question.update({
      where: { id: questionId },
      data,
    });

    /* ---------- OBJECTIVE OPTIONS ---------- */
    if (
      payload.type === 'OBJECTIVE' &&
      payload.options &&
      payload.answerOptionIndex !== undefined
    ) {
      const objective = await tx.objectiveQuestion.findUnique({
        where: { questionId },
      });

      if (!objective) {
        throw new AppError(
          httpStatus.NOT_FOUND,
          'Objective question not found',
        );
      }

      await tx.option.deleteMany({
        where: { objectiveQuestionId: objective.id },
      });

      await tx.option.createMany({
        data: payload.options.map(text => ({
          text,
          objectiveQuestionId: objective.id,
        })),
      });

      const options = await tx.option.findMany({
        where: { objectiveQuestionId: objective.id },
        orderBy: { id: 'asc' },
      });

      await tx.objectiveQuestion.update({
        where: { id: objective.id },
        data: { answerOptionId: options[payload.answerOptionIndex].id },
      });
    }

    return updatedQuestion;
  });
};

// GET QUESTIONS BY CLASS, SUBJECT, CHAPTER AND TYPE
const getQuestionsByClassSubjectChapter = async (
  classId: number,
  subjectId: number,
  chapterId: number,
  type?: string,
) => {
  const where: any = {
    subjectId,
    chapterId,
    classId,
  };

  if (type) {
    where.type = type; // filter by question type if provided
  }

  return prisma.question.findMany({
    where,
    include: {
      objective: { include: { options: true } },
      anahote: true,
      srijonshil: { include: { subQuestions: true } },
      class: true,
      subject: true,
      chapter: true,
      createdBy: true,
    },
  });
};

// GET QUESTIONS WITH DYNAMIC FILTERING
const getAllQuestionsWithFiltering = async (filters: {
  classId?: number;
  subjectId?: number;
  chapterId?: number;
  type?: string;
}) => {
  const where: any = {};

  if (filters.classId) where.classId = filters.classId;
  if (filters.subjectId) where.subjectId = filters.subjectId;
  if (filters.chapterId) where.chapterId = filters.chapterId;
  if (filters.type) where.type = filters.type;

  return prisma.question.findMany({
    where,
    include: {
      objective: { include: { options: true } },
      anahote: true,
      srijonshil: { include: { subQuestions: true } },
      class: true,
      subject: true,
      chapter: true,
      createdBy: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

const deleteQuestion = async (questionId: number, user: ITokenUser) => {
  const question = await prisma.question.findUnique({
    where: { id: questionId },
    include: {
      objective: true,
      anahote: true,
      srijonshil: true,
    },
  });

  if (!question) {
    throw new AppError(httpStatus.NOT_FOUND, 'Question not found');
  }

  // ✅ Teacher permission check
  if (user.role === 'TEACHER') {
    const assigned = await prisma.teacherSubject.findFirst({
      where: {
        teacherId: user.id as number,
        classId: question.classId!,
        subjectId: question.subjectId!,
      },
    });

    if (!assigned) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'Teacher is not assigned to this class and subject',
      );
    }
  }

  // ✅ Delete in transaction
  return prisma.$transaction(async tx => {
    // OBJECTIVE
    if (question.objective) {
      await tx.option.deleteMany({
        where: { objectiveQuestionId: question.objective.id },
      });

      await tx.objectiveQuestion.delete({
        where: { id: question.objective.id },
      });
    }

    // ANAHOTE
    if (question.anahote) {
      await tx.anahoteQuestion.delete({
        where: { id: question.anahote.id },
      });
    }

    // SRIJONSHIL
    if (question.srijonshil) {
      await tx.subQuestion.deleteMany({
        where: { srijonshilQuestionId: question.srijonshil.id },
      });

      await tx.srijonshilQuestion.delete({
        where: { id: question.srijonshil.id },
      });
    }

    // ROOT QUESTION
    await tx.question.delete({
      where: { id: questionId },
    });

    return { id: questionId };
  });
};

const getAllQuestionsFromDBWithPagination = async (
  filters: QuestionFilters,
  options: any,
) => {
  const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);

  const where: any = {};

  // ✅ Filtering
  if (filters.classId) where.classId = filters.classId;
  if (filters.subjectId) where.subjectId = filters.subjectId;
  if (filters.chapterId) where.chapterId = filters.chapterId;
  if (filters.type) where.type = filters.type;

  // ✅ Searching (Objective + Anahote + Srijonshil)
  if (filters.search) {
    where.OR = [
      {
        objective: {
          questionText: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
      },
      {
        anahote: {
          questionText: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
      },
      {
        srijonshil: {
          prompt: {
            contains: filters.search,
            mode: 'insensitive',
          },
        },
      },
    ];
  }

  // ✅ Query
  const data = await prisma.question.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      objective: { include: { options: true } },
      anahote: true,
      srijonshil: { include: { subQuestions: true } },
      class: true,
      subject: true,
      chapter: true,
      createdBy: true,
    },
  });

  const total = await prisma.question.count({ where });

  return {
    meta: {
      page,
      limit,
      total,
    },
    data,
  };
};

// GET QUESTION BY ID
const getQuestionByIdFromDB = async (id: number) => {
  return prisma.question.findUnique({
    where: { id },
    include: {
      objective: { include: { options: true } },
      anahote: true,
      srijonshil: { include: { subQuestions: true } },
      class: true,
      subject: true,
      chapter: true,
      createdBy: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
};

export const QuestionService = {
  createQuestion,
  updateQuestion,
  getQuestionsByClassSubjectChapter,
  getAllQuestionsWithFiltering,
  getAllQuestionsFromDBWithPagination,
  deleteQuestion,
  getQuestionByIdFromDB,
};
