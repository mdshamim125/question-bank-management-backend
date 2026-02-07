// questionHeader.interface.ts

export interface ICreateQuestionHeader {
  schoolName: string;
  location: string;
  className: string; // e.g., নবম/দশম
  subject: string; // e.g., বাংলা ১ম পত্র
  examType: string; // e.g., গদ্য ১ - সুবা
  duration: string; // e.g., ২ ঘন্টা ২০ মিনিট
  fullMark: number; // e.g., ১০০
  remark?: string; // Optional field for any additional notes
}

export interface IUpdateQuestionHeader {
  id: number;
  schoolName?: string;
  location?: string;
  className?: string;
  subject?: string;
  examType?: string;
  duration?: string;
  fullMark?: number;
  remark?: string;
}
