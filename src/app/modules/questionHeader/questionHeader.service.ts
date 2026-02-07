// questionHeader.service.ts
import prisma from '../../utils/prisma';
import {
  ICreateQuestionHeader,
  IUpdateQuestionHeader,
} from './questionHeader.interface';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';

export const createQuestionHeader = async (payload: ICreateQuestionHeader) => {
  const header = await prisma.questionHeader.create({
    data: payload,
  });
  return header;
};

export const updateQuestionHeader = async (
  id: number,
  payload: IUpdateQuestionHeader,
) => {
  const existing = await prisma.questionHeader.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, 'QuestionHeader not found');
  }

  const updated = await prisma.questionHeader.update({
    where: { id },
    data: payload,
  });

  return updated;
};

export const getQuestionHeaders = async () => {
  return prisma.questionHeader.findMany({ orderBy: { createdAt: 'desc' } });
};

export const getQuestionHeaderById = async (id: number) => {
  const header = await prisma.questionHeader.findUnique({ where: { id } });
  if (!header) {
    throw new AppError(httpStatus.NOT_FOUND, 'QuestionHeader not found');
  }
  return header;
};

export const deleteQuestionHeader = async (id: number) => {
  const header = await prisma.questionHeader.delete({ where: { id } });
  return header;
};
