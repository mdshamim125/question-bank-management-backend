import { UserRoleEnum } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import config from '../../config';
import prisma from '../utils/prisma';

const superAdminData = {
  name: 'Super Admin',
  email: 'admin@gmail.com',
  role: UserRoleEnum.SUPERADMIN,
};

const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExists = await prisma.user.findFirst({
      where: { role: UserRoleEnum.SUPERADMIN },
    });

    if (isSuperAdminExists) {
      console.log('Super Admin already exists.');
      return;
    }

    await prisma.user.create({
      data: {
        ...superAdminData,
        password: await bcrypt.hash(
          config.super_admin_password as string,
          Number(config.bcrypt_salt_rounds) || 12,
        ),
      },
    });

    console.log('Super Admin created successfully.');
  } catch (error) {
    console.error('Error seeding Super Admin:', error);
  }
};

export default seedSuperAdmin;
