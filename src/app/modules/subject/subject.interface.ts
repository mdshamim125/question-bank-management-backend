// src/interfaces/subject.interface.ts

export interface ICreateSubject {
  name: string;
  classId: number;
}

export interface IUpdateSubject {
  name?: string;
  classId?: number;
}

export interface ISubjectResponse {
  id: number;
  name: string;
  classId: number;
  createdAt: Date;
  updatedAt: Date;
}
