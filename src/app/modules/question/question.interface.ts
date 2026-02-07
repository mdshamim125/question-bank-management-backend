import { Difficulty } from '@prisma/client';

export type QuestionTypeEnum = 'OBJECTIVE' | 'ANAHOTE' | 'SRIJONSHIL';

// ================= OBJECTIVE QUESTION =================
export interface ICreateObjectiveQuestion {
  type: 'OBJECTIVE';
  classId: number;
  subjectId: number;
  chapterId: number;
  teacherId?: number;
  questionText: string;
  questionMark: number; // ✅ added
  options: string[];
  answerOptionIndex: number;
}

// ================= ANAHOTE QUESTION =================
export interface ICreateAnahoteQuestion {
  type: 'ANAHOTE';
  classId: number;
  subjectId: number;
  chapterId: number;
  teacherId?: number;
  questionText: string;
  questionMark: number; // ✅ added
}

// ================= SRIJONSHIL QUESTION =================
export interface ICreateSrijonshilQuestion {
  type: 'SRIJONSHIL';
  classId: number;
  subjectId: number;
  chapterId: number;
  teacherId?: number;
  prompt: string;
  difficulty: Difficulty;
  subQuestions: {
    questionText: string;
    questionMark: number; // ✅ added for each sub question
    hint?: string;
  }[];
}

// ================= UNION CREATE =================
export type ICreateQuestion =
  | ICreateObjectiveQuestion
  | ICreateAnahoteQuestion
  | ICreateSrijonshilQuestion;

/* ================= UPDATE ================= */

export interface IUpdateObjectiveQuestion {
  id: number;
  type: 'OBJECTIVE';
  classId?: number;
  subjectId?: number;
  chapterId?: number;
  questionText?: string;
  questionMark?: number; // ✅ added
  options?: string[];
  answerOptionIndex?: number;
}

export interface IUpdateAnahoteQuestion {
  id: number;
  type: 'ANAHOTE';
  classId?: number;
  subjectId?: number;
  chapterId?: number;
  questionText?: string;
  questionMark?: number; // ✅ added
}

export interface IUpdateSrijonshilQuestion {
  id: number;
  type: 'SRIJONSHIL';
  classId?: number;
  subjectId?: number;
  chapterId?: number;
  prompt?: string;
  difficulty?: Difficulty;
  subQuestions?: {
    questionText?: string;
    questionMark?: number; // ✅ added
    hint?: string;
  }[];
}

export type IUpdateQuestion =
  | IUpdateObjectiveQuestion
  | IUpdateAnahoteQuestion
  | IUpdateSrijonshilQuestion;

// ================= FILTER =================
export interface QuestionFilters {
  classId?: number;
  subjectId?: number;
  chapterId?: number;
  type?: QuestionTypeEnum;
  search?: string;
}
