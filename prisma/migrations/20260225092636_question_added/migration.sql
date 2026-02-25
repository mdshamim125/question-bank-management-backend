/*
  Warnings:

  - You are about to drop the column `fileType` on the `QuestionPaper` table. All the data in the column will be lost.
  - You are about to drop the column `fileUrl` on the `QuestionPaper` table. All the data in the column will be lost.
  - You are about to drop the `_QuestionPaperQuestions` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `QuestionPaper` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_QuestionPaperQuestions" DROP CONSTRAINT "_QuestionPaperQuestions_A_fkey";

-- DropForeignKey
ALTER TABLE "_QuestionPaperQuestions" DROP CONSTRAINT "_QuestionPaperQuestions_B_fkey";

-- AlterTable
ALTER TABLE "QuestionPaper" DROP COLUMN "fileType",
DROP COLUMN "fileUrl",
ADD COLUMN     "headerId" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "_QuestionPaperQuestions";

-- CreateTable
CREATE TABLE "QuestionPaperQuestion" (
    "id" SERIAL NOT NULL,
    "questionPaperId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "customMark" DOUBLE PRECISION,

    CONSTRAINT "QuestionPaperQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuestionPaper" ADD CONSTRAINT "QuestionPaper_headerId_fkey" FOREIGN KEY ("headerId") REFERENCES "QuestionHeader"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionPaperQuestion" ADD CONSTRAINT "QuestionPaperQuestion_questionPaperId_fkey" FOREIGN KEY ("questionPaperId") REFERENCES "QuestionPaper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionPaperQuestion" ADD CONSTRAINT "QuestionPaperQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
