/*
  Warnings:

  - A unique constraint covering the columns `[teacherId,subjectId,classId]` on the table `TeacherSubject` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `classId` to the `TeacherSubject` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "TeacherSubject_teacherId_subjectId_key";

-- AlterTable
ALTER TABLE "TeacherSubject" ADD COLUMN     "classId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "TeacherSubject_teacherId_subjectId_classId_key" ON "TeacherSubject"("teacherId", "subjectId", "classId");

-- AddForeignKey
ALTER TABLE "TeacherSubject" ADD CONSTRAINT "TeacherSubject_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
