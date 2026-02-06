import prisma from '../../utils/prisma';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { ICreateQuestion } from './question.interface';
import { ITokenUser } from '../../interface/auth.interface';

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
        },
      });

      return { question, anahote };
    }

    // 4️⃣ SRIJONSHIL
    if (payload.type === 'SRIJONSHIL') {
      const srijonshil = await tx.srijonshilQuestion.create({
        data: {
          questionId: question.id,
          prompt: payload.prompt,
          difficulty: payload.difficulty,
          subQuestions: { create: payload.subQuestions },
        },
        include: { subQuestions: true },
      });

      return { question, srijonshil };
    }

    throw new AppError(httpStatus.BAD_REQUEST, 'Unsupported question type');
  });
};

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

export const QuestionService = {
  createQuestion,
  getQuestionsByClassSubjectChapter,
};
