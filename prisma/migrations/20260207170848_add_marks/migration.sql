-- AlterTable
ALTER TABLE "AnahoteQuestion" ADD COLUMN     "questionMark" DOUBLE PRECISION NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "ObjectiveQuestion" ADD COLUMN     "questionMark" DOUBLE PRECISION NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "SubQuestion" ADD COLUMN     "questionMark" DOUBLE PRECISION NOT NULL DEFAULT 1;
