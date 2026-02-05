// src/controllers/user.controller.ts

import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { UserService } from './user.service';
import sendResponse from '../../utils/sendResponse';
import { IUpdateUserRole } from './user.interface';

// GET ALL USERS
export const getAllUsers = catchAsync(async (_req: Request, res: Response) => {
  const result = await UserService.getAllUsers();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Users retrieved successfully',
    data: result,
  });
});

// GET SINGLE USER
export const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const result = await UserService.getSingleUser(userId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

// CREATE USER
export const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.createUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

// UPDATE ROLE
export const updateUserRole = catchAsync(
  async (req: Request, res: Response) => {
    const userId = Number(req.params.id);
    const payload: IUpdateUserRole = req.body;

    const result = await UserService.updateUserRole(userId, payload);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User role updated successfully',
      data: result,
    });
  },
);

export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  await UserService.deleteUser(userId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User deleted successfully',
    data: null,
  });
});

export const getTeacherSubjects = catchAsync(
  async (req: Request, res: Response) => {
    const teacherId = Number(req.params.teacherId);
    const result = await UserService.getTeacherSubjects(teacherId);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Teacher subjects retrieved successfully',
      data: result,
    });
  },
);

export const UserController = {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUserRole,
  deleteUser,
  getTeacherSubjects,
};
