// src/services/teacherSubject.service.ts

import httpStatus from 'http-status';
import prisma from '../../utils/prisma';
import { IAssignTeacher } from './teacherSubject.interface';
import AppError from '../../errors/AppError';

// ASSIGN TEACHER → SUBJECT → CLASS
export const assignTeacherToSubject = async (payload: IAssignTeacher) => {
  const { teacherId, subjectId, classId } = payload;

  // 1️⃣ Check teacher exists & role
  const teacher = await prisma.user.findUnique({
    where: { id: teacherId },
  });

  if (!teacher || teacher.role !== 'TEACHER') {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Teacher not found or invalid role',
    );
  }

  // 2️⃣ Check subject exists AND belongs to class
  const subject = await prisma.subject.findFirst({
    where: {
      id: subjectId,
      classId,
    },
  });

  if (!subject) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Subject not found for the given class',
    );
  }

  // 3️⃣ Prevent duplicate assignment
  const existing = await prisma.teacherSubject.findUnique({
    where: {
      teacherId_subjectId_classId: {
        teacherId,
        subjectId,
        classId,
      },
    },
  });

  if (existing) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Teacher already assigned to this subject for this class',
    );
  }

  // 4️⃣ Create assignment
  return prisma.teacherSubject.create({
    data: {
      teacherId,
      subjectId,
      classId,
    },
    include: {
      teacher: true,
      subject: {
        include: { class: true },
      },
    },
  });
};

// GET ALL ASSIGNMENTS
export const getAllTeacherAssignments = async () => {
  return prisma.teacherSubject.findMany({
    include: {
      teacher: true,
      subject: {
        include: { class: true },
      },
      class: true,
    },
  });
};

// REMOVE ASSIGNMENT (teacher + subject + class)
export const removeTeacherFromSubject = async (id: number) => {
  const existing = await prisma.teacherSubject.findUnique({
    where: { id },
  });

  if (!existing) {
    throw new AppError(httpStatus.NOT_FOUND, 'Assignment not found');
  }

  return prisma.teacherSubject.delete({
    where: { id },
  });
};

// GET SUBJECTS BY TEACHER
const getTeacherSubjectsByTeacherId = async (teacherId: number) => {
  return prisma.teacherSubject.findMany({
    where: { teacherId },
    include: {
      subject: {
        include: { class: true },
      },
      class: true,
    },
  });
};

export const TeacherSubjectService = {
  assignTeacherToSubject,
  getAllTeacherAssignments,
  removeTeacherFromSubject,
  getTeacherSubjectsByTeacherId,
};
