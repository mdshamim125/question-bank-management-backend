// src/interfaces/class.interface.ts

export interface ICreateClass {
  name: string;
}

export interface IUpdateClass {
  name?: string;
}

export interface IClassResponse {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
