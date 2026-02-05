// src/modules/chapter/chapter.service.ts

import prisma from '../../utils/prisma';
import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { ICreateChapter, IUpdateChapter } from './chapter.interface';

const createChapter = async (payload: ICreateChapter) => {
  // validate class
  const classExists = await prisma.class.findUnique({
    where: { id: payload.classId },
  });
  if (!classExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Class not found');
  }

  // validate subject
  const subjectExists = await prisma.subject.findUnique({
    where: { id: payload.subjectId },
  });
  if (!subjectExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Subject not found');
  }

  return prisma.chapter.create({
    data: payload,
  });
};

const getAllChapters = async () => {
  return prisma.chapter.findMany({
    include: {
      class: true,
      subject: true,
    },
  });
};

const getChapterById = async (id: number) => {
  const chapter = await prisma.chapter.findUnique({
    where: { id },
    include: {
      class: true,
      subject: true,
    },
  });

  if (!chapter) {
    throw new AppError(httpStatus.NOT_FOUND, 'Chapter not found');
  }

  return chapter;
};

const updateChapter = async (id: number, payload: IUpdateChapter) => {
  await getChapterById(id);

  return prisma.chapter.update({
    where: { id },
    data: payload,
  });
};

const deleteChapter = async (id: number) => {
  await getChapterById(id);

  return prisma.chapter.delete({
    where: { id },
  });
};

export const ChapterService = {
  createChapter,
  getAllChapters,
  getChapterById,
  updateChapter,
  deleteChapter,
};
