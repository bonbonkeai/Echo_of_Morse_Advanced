-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "learningLevel" INTEGER NOT NULL DEFAULT 1;
