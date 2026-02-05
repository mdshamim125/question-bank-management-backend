// src/services/class.service.ts

import httpStatus from 'http-status';
import { ICreateClass, IUpdateClass } from './class.interface';
import prisma from '../../utils/prisma';
import AppError from '../../errors/AppError';

 const createClass = async (payload: ICreateClass) => {
  const existingClass = await prisma.class.findUnique({
    where: { name: payload.name },
  });

  if (existingClass) {
    throw new AppError(httpStatus.CONFLICT, 'Class already exists');
  }

  const newClass = await prisma.class.create({
    data: { name: payload.name },
  });

  return newClass;
};

 const getAllClasses = async () => {
  return prisma.class.findMany({
    include: { subjects: true, teachers: true },
  });
};

 const getClassById = async (id: number) => {
  const classData = await prisma.class.findUnique({
    where: { id },
    include: { subjects: true, teachers: true },
  });

  if (!classData) {
    throw new AppError(httpStatus.NOT_FOUND, 'Class not found');
  }

  return classData;
};

 const updateClass = async (id: number, payload: IUpdateClass) => {
  const classData = await prisma.class.findUnique({ where: { id } });
  if (!classData) {
    throw new AppError(httpStatus.NOT_FOUND, 'Class not found');
  }

  return prisma.class.update({
    where: { id },
    data: { ...payload },
  });
};

 const deleteClass = async (id: number) => {
  const classData = await prisma.class.findUnique({ where: { id } });
  if (!classData) {
    throw new AppError(httpStatus.NOT_FOUND, 'Class not found');
  }

  return prisma.class.delete({ where: { id } });
};

export const ClassServices = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
};
