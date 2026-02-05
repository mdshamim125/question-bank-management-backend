// src/controllers/teacherSubject.controller.ts

import { Request, Response } from 'express';
import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { TeacherSubjectService } from './teacherSubject.service';
import { IAssignTeacher } from './teacherSubject.interface';

// ASSIGN TEACHER TO SUBJECT
export const assignTeacher = catchAsync(async (req: Request, res: Response) => {
  const payload: IAssignTeacher = req.body;

  const result = await TeacherSubjectService.assignTeacherToSubject(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Teacher assigned to subject successfully',
    data: result,
  });
});

// GET ALL ASSIGNMENTS
export const getAllAssignments = catchAsync(async (_req, res) => {
  const result = await TeacherSubjectService.getAllTeacherAssignments();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Teacher assignments retrieved successfully',
    data: result,
  });
});

// REMOVE TEACHER FROM SUBJECT (WITH CLASS)
export const removeAssignment = catchAsync(async (req: Request, res: Response) => {
  const teacherId = Number(req.params.teacherId);
  const subjectId = Number(req.params.subjectId);
  const classId = Number(req.params.classId);

  const result = await TeacherSubjectService.removeTeacherFromSubject(
    teacherId,
    subjectId,
    classId,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Teacher removed from subject successfully',
    data: result,
  });
});

// GET SUBJECTS BY TEACHER
export const getTeacherSubjectsByTeacherId = catchAsync(
  async (req: Request, res: Response) => {
    const teacherId = Number(req.params.teacherId);

    const result =
      await TeacherSubjectService.getTeacherSubjectsByTeacherId(teacherId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Teacher subjects retrieved successfully',
      data: result,
    });
  },
);

export const TeacherSubjectController = {
  assignTeacher,
  getAllAssignments,
  removeAssignment,
  getTeacherSubjectsByTeacherId,
};
