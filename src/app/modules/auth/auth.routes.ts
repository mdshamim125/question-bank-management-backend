// auth.route.ts (adding register)
import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthController } from './auth.controller';
import { loginSchema, registerSchema } from './auth.validation';
import { UserRoleEnum } from '@prisma/client';
import auth from '../../middlewares/auth';
const router = express.Router();

router.post(
  '/register',
  validateRequest(registerSchema),
  // auth(UserRoleEnum.SUPERADMIN, UserRoleEnum.ADMIN),
  AuthController.register,
);

router.post('/login', validateRequest(loginSchema), AuthController.login);

// router.post(
//   '/verify-otp',
//   validateRequest(verifyOtpSchema),
//   AuthController.verifyOtp,
// );

// router.post(
//   '/forgot-password',
//   validateRequest(authValidation.forgotPasswordValidation),
//   AuthController.forgotPassword,
// );
// router.post(
//   '/reset-password',
//   validateRequest(authValidation.resetPasswordValidation),
//   AuthController.resetPassword,
// );

export const AuthRoutes = router;
