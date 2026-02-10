import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../config';
import AppError from '../errors/AppError';
import prisma from '../utils/prisma';
import { verifyToken } from '../utils/verifyToken';

const auth = (...roles: string[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      let token: string | undefined;

      // 1️⃣ From Authorization Header (Bearer token)
      if (req.headers.authorization?.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
      }

      // 2️⃣ From Authorization Header (raw token)
      if (!token && req.headers.authorization) {
        token = req.headers.authorization;
      }

      // 3️⃣ From Cookie (manual parse)
      if (!token && req.headers.cookie) {
        token = req.headers.cookie.split('accessToken=')[1]?.split(';')[0];
      }

      // 4️⃣ From cookie-parser (recommended)
      if (!token && (req as any).cookies?.accessToken) {
        token = (req as any).cookies.accessToken;
      }

      console.log('FINAL TOKEN:', token);

      if (!token) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
      }

      // Verify JWT
      const verifyUserToken = verifyToken(
        token,
        config.jwt.access_secret as Secret,
      );

      // Check user exists
      const user = await prisma.user.findUnique({
        where: { id: Number(verifyUserToken.id) },
      });

      if (!user) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
      }

      // Attach user to request
      req.user = verifyUserToken;

      // Role-based access control
      if (roles.length && !roles.includes(verifyUserToken.role)) {
        throw new AppError(httpStatus.FORBIDDEN, 'Forbidden!');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
