import prisma from '../../utils/prisma';

// const createOneQuestionPaper = async (
//   userId: number,
//   payload: {
//     title: string;
//     headerId?: number;
//     questions: {
//       questionId: number;
//       order: number;
//       customMark?: number;
//     }[];
//   },
// ) => {
//   const { title, headerId, questions } = payload;

//   const paper = await prisma.questionPaper.create({
//     data: {
//       title,
//       headerId,
//       createdById: userId,
//       questions: {
//         create: questions.map(q => ({
//           questionId: q.questionId,
//           order: q.order,
//           customMark: q.customMark,
//         })),
//       },
//     },
//     include: {
//       header: true,
//       questions: {
//         include: {
//           question: true,
//         },
//       },
//     },
//   });

//   return paper;
// };

interface ICreateQuestionPaperPayload {
  title: string;
  header: {
    schoolName: string;
    location: string;
    className: string;
    subject: string;
    examType: string;
    duration: string;
    fullMark: number;
    remark?: string;
  };
  questionIds: number[];
}

const createOneQuestionPaper = async (
  payload: ICreateQuestionPaperPayload,
  user: any,
) => {
  console.log(payload, user);
  const { title, header, questionIds } = payload;

  // 🛑 SAFETY CHECK (THIS PREVENTS YOUR ERROR)
  if (!Array.isArray(questionIds) || questionIds.length === 0) {
    throw new Error('questionIds must be a non-empty array');
  }

  // 1️⃣ Create header
  const savedHeader = await prisma.questionHeader.create({
    data: {
      ...header,
    },
  });

  // 2️⃣ Create question paper
  const questionPaper = await prisma.questionPaper.create({
    data: {
      title,
      headerId: savedHeader.id,
      createdById: user.id,
      questions: {
        create: questionIds.map((qid, index) => ({
          questionId: qid,
          order: index + 1,
        })),
      },
    },
    include: {
      questions: true,
      header: true,
    },
  });

  return questionPaper;
};

const getAllQuestionPapers = async () => {
  return prisma.questionPaper.findMany({
    include: {
      header: true,
      createdBy: true,
      questions: {
        include: {
          question: {
            include: {
              objective: { include: { options: true } },
              anahote: true,
              srijonshil: { include: { subQuestions: true } },
            },
          },
        },
      },
    },
  });
};

export const QuestionPaperService = {
  createOneQuestionPaper,
  getAllQuestionPapers,
};
