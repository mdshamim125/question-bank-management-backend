// src/interfaces/user.interface.ts

export interface ICreateUser {
  name: string;
  email: string;
  password: string;
  role?: 'SUPERADMIN' | 'ADMIN' | 'TEACHER';
}

export interface IUpdateUserRole {
  role: 'SUPERADMIN' | 'ADMIN' | 'TEACHER';
}
