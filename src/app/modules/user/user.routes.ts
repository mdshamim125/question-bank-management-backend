// src/routes/user.routes.ts

import { Router } from 'express';
import { UserController } from './user.controller';
import validateRequest from '../../middlewares/validateRequest';
import { createUserSchema, updateUserRoleSchema } from './user.validation';
import auth from '../../middlewares/auth';

const router = Router();

// GET ALL USERS
router.get('/', UserController.getAllUsers);

router.get("/my-profile", auth(), UserController.getMyProfile);

// GET SINGLE USER
router.get('/:id', UserController.getSingleUser);

// CREATE USER
router.post('/', validateRequest(createUserSchema), UserController.createUser);

// UPDATE ROLE
router.patch(
  '/:id',
  validateRequest(updateUserRoleSchema),
  UserController.updateUserRole,
);




export const UserRouters = router;
