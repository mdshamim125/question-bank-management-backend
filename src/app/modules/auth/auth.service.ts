// auth.service.ts (adding registerUserIntoDB)
import * as bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import config from '../../../config';
import AppError from '../../errors/AppError';
import { generateToken } from '../../utils/generateToken';
import prisma from '../../utils/prisma';
import { ILogin, IRegister } from './auth.interface';
import { UserRoleEnum } from '@prisma/client';

const register = async (payload: IRegister) => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, 'User already registered');
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    payload.password!,
    Number(config.bcrypt_salt_rounds) || 10,
  );

  // Create user
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: payload.role || UserRoleEnum.TEACHER, // default to TEACHER
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

const login = async (payload: ILogin) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  }

  const isPasswordMatch = await bcrypt.compare(payload.password, user.password);
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
  }

  // Generate JWT
  const accessToken = generateToken(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    config.jwt.access_secret as string,
    config.jwt.access_expires_in as string,
  );

  return {
    accessToken,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  };
};

// const verifyOtpAndCreateUser = async (payload: IVerifyOtp) => {
//   const otpRecord = await prisma.otp.findFirst({
//     where: {
//       email: payload.email,
//       otp: payload.otp,
//       expiresAt: { gt: new Date() },
//     },
//   });

//   if (!otpRecord) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Invalid or expired OTP');
//   }

//   const tempUser = await prisma.tempUser.findUnique({
//     where: { email: payload.email },
//   });

//   if (!tempUser) {
//     throw new AppError(httpStatus.NOT_FOUND, 'Registration session expired');
//   }

//   const hashedPassword = await bcrypt.hash(
//     payload.password,
//     Number(config.bcrypt_salt_rounds) || 12,
//   );

//   const user = await prisma.user.create({
//     data: {
//       ...tempUser,
//       password: hashedPassword,
//       isEmailVerified: true,
//     },
//   });

//   await prisma.otp.deleteMany({ where: { email: payload.email } });
//   await prisma.tempUser.delete({ where: { email: payload.email } });

//   const accessToken = generateToken(
//     {
//       id: user.id,
//       universityId: user.universityId || '',
//       firstName: user.firstName,
//       lastName: user.lastName,
//       email: user.email,
//       role: user.role,
//       program: user.program,
//       departmentId: user.departmentId,
//     },
//     config.jwt.access_secret as Secret,
//     config.jwt.access_expires_in as string,
//   );

//   return { accessToken };
// };

// const loginUserFromDB = async (payload: {
//   email: string;
//   password: string;
// }) => {
//   const userData = await prisma.user.findUniqueOrThrow({
//     where: {
//       email: payload.email,
//     },
//     select: {
//       id: true,
//       universityId: true,
//       firstName: true,
//       lastName: true,
//       email: true,
//       password: true,
//       role: true,
//     },
//   });
//   const isCorrectPassword: Boolean = await bcrypt.compare(
//     payload.password,
//     userData.password,
//   );
//   if (!isCorrectPassword) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Password incorrect');
//   }
//   const accessToken = await generateToken(
//     {
//       id: userData.id,
//       universityId: userData.universityId,
//       firstName: userData.firstName,
//       lastName: userData.lastName,
//       email: userData.email,
//       role: userData.role,
//     },
//     config.jwt.access_secret as Secret,
//     config.jwt.access_expires_in as string,
//   );
//   return {
//     id: userData.id,
//     firstName: userData.firstName,
//     lastName: userData.lastName,
//     email: userData.email,
//     role: userData.role,
//     accessToken: accessToken,
//   };
// };

// const forgotPassword = async (email: string): Promise<{ message: string }> => {
//   // 1️⃣ Check if user exists
//   const user = await prisma.user.findUnique({ where: { email } });
//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'User not found');
//   }

//   // 2️⃣ Delete any existing OTPs for this email
//   await prisma.otp.deleteMany({ where: { email } });

//   // 3️⃣ Generate a 6-digit OTP
//   const otp = Math.floor(100000 + Math.random() * 900000).toString();

//   // 4️⃣ Store OTP in database
//   await prisma.otp.create({
//     data: {
//       email,
//       otp,
//       expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 min expiry
//     },
//   });

//   // 5️⃣ Send OTP via email
//   //switchToGmailProvider(); // Uncomment if using Gmail
//   await emailService.sendPasswordResetOtp(email, otp);

//   return {
//     message: 'Password reset OTP sent successfully. Please check your email.',
//   };
// };

// const resetPassword = async (
//   email: string,
//   otp: string,
//   newPassword: string,
// ): Promise<{ message: string }> => {
//   // Find OTP record
//   const otpRecord = await prisma.otp.findFirst({
//     where: {
//       email,
//       otp,
//       expiresAt: { gt: new Date() }, // ensure it's not expired
//     },
//   });

//   if (!otpRecord) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'Invalid OTP or email');
//   }

//   // Find the user
//   const user = await prisma.user.findUnique({
//     where: { email },
//   });

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'User not found');
//   }

//   // Hash new password
//   const hashedPassword = await bcrypt.hash(newPassword, 10);

//   // Update user password
//   await prisma.user.update({
//     where: { id: user.id },
//     data: { password: hashedPassword },
//   });

//   // Delete OTP after use
//   await prisma.otp.deleteMany({
//     where: { email },
//   });

//   return { message: 'Password reset successfully' };
// };

export const AuthServices = {
  register,
  login,
};
