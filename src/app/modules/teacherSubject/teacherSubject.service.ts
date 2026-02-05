// src/services/teacherSubject.service.ts

import httpStatus from 'http-status';
import prisma from '../../utils/prisma';
import { IAssignTeacher } from './teacherSubject.interface';
import AppError from '../../errors/AppError';

export const assignTeacherToSubject = async (payload: IAssignTeacher) => {
  // Check teacher exists and is role TEACHER
  const teacher = await prisma.user.findUnique({ where: { id: payload.teacherId } });
  if (!teacher || teacher.role !== 'TEACHER') {
    throw new AppError(httpStatus.NOT_FOUND, 'Teacher not found or invalid role');
  }

  // Check subject exists
  const subject = await prisma.subject.findUnique({ where: { id: payload.subjectId } });
  if (!subject) {
    throw new AppError(httpStatus.NOT_FOUND, 'Subject not found');
  }

  // Check if already assigned
  const existing = await prisma.teacherSubject.findUnique({
    where: {
      teacherId_subjectId: { teacherId: payload.teacherId, subjectId: payload.subjectId },
    },
  });

  if (existing) {
    throw new AppError(httpStatus.CONFLICT, 'Teacher already assigned to this subject');
  }

  // Create assignment
  return prisma.teacherSubject.create({ data: payload });
};

export const getAllTeacherAssignments = async () => {
  return prisma.teacherSubject.findMany({
    include: { teacher: true, subject: { include: { class: true } } },
  });
};

export const removeTeacherFromSubject = async (teacherId: number, subjectId: number) => {
  const existing = await prisma.teacherSubject.findUnique({
    where: { teacherId_subjectId: { teacherId, subjectId } },
  });

  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, 'Assignment not found');
  }

  return prisma.teacherSubject.delete({
    where: { teacherId_subjectId: { teacherId, subjectId } },
  });
};

const getTeacherSubjectsByTeacherId = async (teacherId: number) => {
  return prisma.teacherSubject.findMany({
    where: { teacherId },
    include: { subject: { include: { class: true } } },
  });
};

export const TeacherSubjectService = {
  assignTeacherToSubject,
  getAllTeacherAssignments,
  removeTeacherFromSubject,
  getTeacherSubjectsByTeacherId,
};
