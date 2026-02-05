// src/controllers/subject.controller.ts

import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { ICreateSubject, IUpdateSubject } from './subject.interface';
import { SubjectServices } from './subject.service';

// CREATE SUBJECT
export const createSubject = catchAsync(async (req: Request, res: Response) => {
  const payload: ICreateSubject = req.body;
  const result = await SubjectServices.createSubject(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Subject created successfully',
    data: result,
  });
});

// GET ALL SUBJECTS
export const getAllSubjects = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SubjectServices.getAllSubjects();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Subjects retrieved successfully',
      data: result,
    });
  },
);

// GET SINGLE SUBJECT
export const getSubjectById = catchAsync(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await SubjectServices.getSubjectById(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Subject retrieved successfully',
      data: result,
    });
  },
);

// UPDATE SUBJECT
export const updateSubject = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const payload: IUpdateSubject = req.body;

  const result = await SubjectServices.updateSubject(id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subject updated successfully',
    data: result,
  });
});

// DELETE SUBJECT
export const deleteSubject = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await SubjectServices.deleteSubject(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Subject deleted successfully',
    data: result,
  });
});

export const SubjectController = {
  createSubject,
  getAllSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};
