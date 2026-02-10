// src/controllers/user.controller.ts

import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { UserService } from './user.service';
import sendResponse from '../../utils/sendResponse';
import { IUpdateUserRole } from './user.interface';
import prisma from '../../utils/prisma';

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

// GET MY PROFILE
// ===============================
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  // req.user should be populated by auth middleware
  const userId = req.user?.id;

  if (!userId) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: 'Unauthorized',
      data: null,
    });
  }

  const profile = await prisma.user.findUnique({
    where: { id: Number(userId) },
    select: {
      name: true,
      email: true,
      role: true,
    },
  });

  if (!profile) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: 'Profile not found',
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Profile fetched successfully',
    data: profile,
  });
});

export const UserController = {
  getAllUsers,
  getSingleUser,
  createUser,
  updateUserRole,
  deleteUser,
  getTeacherSubjects,
  getMyProfile,
};
