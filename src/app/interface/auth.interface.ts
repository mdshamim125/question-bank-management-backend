import { JwtPayload } from 'jsonwebtoken';

export interface ITokenUser {
  id: string | number;
  name: string;
  email: string;
  role: string;
  classId: number;
  subjectId: number;
}

export interface IDecodedUser extends JwtPayload, ITokenUser {}
