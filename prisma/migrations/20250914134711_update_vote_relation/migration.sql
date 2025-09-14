/*
  Warnings:

  - You are about to drop the column `pollId` on the `Vote` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,optionId]` on the table `Vote` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Vote" DROP CONSTRAINT "Vote_pollId_fkey";

-- DropIndex
DROP INDEX "public"."Vote_userId_pollId_key";

-- AlterTable
ALTER TABLE "public"."Vote" DROP COLUMN "pollId";

-- CreateIndex
CREATE UNIQUE INDEX "Vote_userId_optionId_key" ON "public"."Vote"("userId", "optionId");
