// auth.controller.ts (adding registerUser)
import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AuthServices } from './auth.service';
import { ILogin, IRegister } from './auth.interface';
import { setAuthCookie } from '../../utils/setCookie';

const register = catchAsync(async (req: Request, res: Response) => {
  const payload: IRegister = req.body;
  const result = await AuthServices.register(payload);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

// --------------------
// LOGIN
// --------------------
const login = catchAsync(async (req: Request, res: Response) => {
  const payload: ILogin = req.body;
  const result = await AuthServices.login(payload);

  console.log(result);

  setAuthCookie(res, {
    accessToken: result.accessToken,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Login successful',
    data: result,
  });
});

// const verifyOtp = catchAsync(async (req: Request, res: Response) => {
//   const result = await AuthServices.verifyOtpAndCreateUser(req.body);

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: 'Account verified successfully',
//     data: result,
//   });
// });

// const forgotPassword = catchAsync(async (req: Request, res: Response) => {
//   const { email } = req.body;
//   const result = await AuthServices.forgotPassword(email);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: result.message,
//     data: null,
//   });
// });
// const resetPassword = catchAsync(async (req: Request, res: Response) => {
//   const { email, otp, newPassword } = req.body;
//   const result = await AuthServices.resetPassword(email, otp, newPassword);

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: result.message,
//     data: null,
//   });
// });
export const AuthController = {
  register,
  login,
};
