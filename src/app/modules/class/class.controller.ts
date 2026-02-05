// src/controllers/class.controller.ts

import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { ICreateClass, IUpdateClass } from './class.interface';
import { ClassServices } from './class.service';
import sendResponse from '../../utils/sendResponse';

// CREATE CLASS
const createClass = catchAsync(async (req: Request, res: Response) => {
  const payload: ICreateClass = req.body;
  const result = await ClassServices.createClass(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Class created successfully',
    data: result,
  });
});

// GET ALL CLASSES
const getAllClasses = catchAsync(async (req: Request, res: Response) => {
  const result = await ClassServices.getAllClasses();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Classes retrieved successfully',
    data: result,
  });
});

// GET SINGLE CLASS
const getClassById = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await ClassServices.getClassById(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Class retrieved successfully',
    data: result,
  });
});

// UPDATE CLASS
const updateClass = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const payload: IUpdateClass = req.body;

  const result = await ClassServices.updateClass(id, payload);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Class updated successfully',
    data: result,
  });
});

// DELETE CLASS
const deleteClass = catchAsync(async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const result = await ClassServices.deleteClass(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Class deleted successfully',
    data: result,
  });
});

export const ClassController = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
};
