// src/interfaces/teacherSubject.interface.ts

export interface IAssignTeacher {
  teacherId: number;
  subjectId: number;
}

export interface ITeacherSubjectResponse {
  id: number;
  teacherId: number;
  subjectId: number;
}
