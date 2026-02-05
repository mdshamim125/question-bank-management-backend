// src/services/user.service.ts
import bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import prisma from '../../utils/prisma';
import AppError from '../../errors/AppError';
import { ICreateUser, IUpdateUserRole } from './user.interface';

export const getAllUsers = async () => {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
};

export const getSingleUser = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  return user;
};

export const createUser = async (payload: ICreateUser) => {
  const existing = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (existing) throw new AppError(httpStatus.CONFLICT, 'User already exists');

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  return prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: payload.role || 'TEACHER',
    },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
};

export const updateUserRole = async (
  userId: number,
  payload: IUpdateUserRole,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  return prisma.user.update({
    where: { id: userId },
    data: { role: payload.role },
    select: { id: true, name: true, email: true, role: true },
  });
};

export const deleteUser = async (userId: number) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(httpStatus.NOT_FOUND, 'User not found');

  return prisma.user.delete({ where: { id: userId } });
};

export const getTeacherSubjects = async (teacherId: number) => {
  const teacher = await prisma.user.findUnique({ where: { id: teacherId } });
  if (!teacher || teacher.role !== 'TEACHER') {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Teacher not found or invalid role',
    );
  }

  return prisma.teacherSubject.findMany({
    where: { teacherId },
    select: { id: true, teacherId: true, subjectId: true },
  });
};

export const UserService = {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUserRole,
  deleteUser,
  getTeacherSubjects,
};
