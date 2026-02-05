// src/modules/chapter/chapter.interface.ts

export interface ICreateChapter {
  name: string;
  classId: number;
  subjectId: number;
}

export interface IUpdateChapter {
  name?: string;
}

export interface IChapterResponse {
  id: number;
  name: string;
  classId: number;
  subjectId: number;
  createdAt: Date;
  updatedAt: Date;
}
