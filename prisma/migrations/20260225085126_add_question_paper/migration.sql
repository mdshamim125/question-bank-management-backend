-- CreateTable
CREATE TABLE "QuestionPaper" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuestionPaper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_QuestionPaperQuestions" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_QuestionPaperQuestions_AB_unique" ON "_QuestionPaperQuestions"("A", "B");

-- CreateIndex
CREATE INDEX "_QuestionPaperQuestions_B_index" ON "_QuestionPaperQuestions"("B");

-- AddForeignKey
ALTER TABLE "QuestionPaper" ADD CONSTRAINT "QuestionPaper_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionPaperQuestions" ADD CONSTRAINT "_QuestionPaperQuestions_A_fkey" FOREIGN KEY ("A") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionPaperQuestions" ADD CONSTRAINT "_QuestionPaperQuestions_B_fkey" FOREIGN KEY ("B") REFERENCES "QuestionPaper"("id") ON DELETE CASCADE ON UPDATE CASCADE;
