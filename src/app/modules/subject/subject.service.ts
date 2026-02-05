// src/services/subject.service.ts

import httpStatus from 'http-status';
import prisma from '../../utils/prisma';
import { ICreateSubject, IUpdateSubject } from './subject.interface';
import AppError from '../../errors/AppError';

export const createSubject = async (payload: ICreateSubject) => {
  // Check if class exists
  const classExists = await prisma.class.findUnique({
    where: { id: payload.classId },
  });
  if (!classExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Class not found');
  }

  // Optional: check if subject with same name exists in that class
  const existingSubject = await prisma.subject.findFirst({
    where: {
      name: payload.name,
      classId: payload.classId,
    },
  });

  if (existingSubject) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Subject already exists in this class',
    );
  }

  return prisma.subject.create({
    data: payload,
  });
};

export const getAllSubjects = async () => {
  return prisma.subject.findMany({
    include: { class: true, teachers: true },
  });
};

export const getSubjectById = async (id: number) => {
  const subject = await prisma.subject.findUnique({
    where: { id },
    include: { class: true, teachers: true },
  });

  if (!subject) {
    throw new AppError(httpStatus.NOT_FOUND, 'Subject not found');
  }

  return subject;
};

export const updateSubject = async (id: number, payload: IUpdateSubject) => {
  const subject = await prisma.subject.findUnique({ where: { id } });
  if (!subject) {
    throw new AppError(httpStatus.NOT_FOUND, 'Subject not found');
  }

  // If classId is being updated, verify class exists
  if (payload.classId) {
    const classExists = await prisma.class.findUnique({
      where: { id: payload.classId },
    });
    if (!classExists) {
      throw new AppError(httpStatus.NOT_FOUND, 'Class not found');
    }
  }

  return prisma.subject.update({
    where: { id },
    data: payload,
  });
};

export const deleteSubject = async (id: number) => {
  const subject = await prisma.subject.findUnique({ where: { id } });
  if (!subject) {
    throw new AppError(httpStatus.NOT_FOUND, 'Subject not found');
  }

  return prisma.subject.delete({ where: { id } });
};

export const SubjectServices = {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};
