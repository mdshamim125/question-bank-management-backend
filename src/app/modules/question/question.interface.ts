import { Difficulty } from '@prisma/client';

export type QuestionTypeEnum = 'OBJECTIVE' | 'ANAHOTE' | 'SRIJONSHIL';

// OBJECTIVE QUESTION
export interface ICreateObjectiveQuestion {
  type: 'OBJECTIVE';
  classId: number;
  subjectId: number;
  chapterId: number; // added
  teacherId?: number;
  questionText: string;
  options: string[];
  answerOptionIndex: number;
}

// ANAHOTE QUESTION
export interface ICreateAnahoteQuestion {
  type: 'ANAHOTE';
  classId: number;
  subjectId: number;
  chapterId: number; // added
  teacherId?: number;
  questionText: string;
}

// SRIJONSHIL QUESTION
export interface ICreateSrijonshilQuestion {
  type: 'SRIJONSHIL';
  classId: number;
  subjectId: number;
  chapterId: number; // added
  teacherId?: number;
  prompt: string;
  difficulty: Difficulty;
  subQuestions: {
    questionText: string;
    hint?: string;
  }[];
}

// UNION TYPE
export type ICreateQuestion =
  | ICreateObjectiveQuestion
  | ICreateAnahoteQuestion
  | ICreateSrijonshilQuestion;
