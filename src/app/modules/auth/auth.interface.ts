import { UserRoleEnum } from '@prisma/client';

export interface IRegister {
  name: string;
  email: string;
  password: string;
  role?: UserRoleEnum; // optional, default to TEACHER if not provided
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRoleEnum;
  };
}

export interface IVerifyOtp {
  email: string;
  otp: string;
  password: string;
}

export interface ILoginUser {
  email: string;
  password: string;
}

export interface IAuthResponse {
  accessToken: string;
  refreshToken?: string;
}

export type IChangePassword = {
  oldPassword: string;
  newPassword: string;
};

export type IForgotPassword = {
  email: string;
};

export type IResetPassword = {
  email: string;
  otp: string;
  newPassword: string;
};

export type IUpdateProfile = {
  firstName?: string;
  lastName?: string;
  bio?: string;
  age?: number;
};
