-- CreateTable
CREATE TABLE "QuestionHeader" (
    "id" SERIAL NOT NULL,
    "schoolName" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "examType" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "fullMark" INTEGER NOT NULL,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionHeader_pkey" PRIMARY KEY ("id")
);
