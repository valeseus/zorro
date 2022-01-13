/*
  Warnings:

  - You are about to drop the column `email` on the `UnsubmittedProfile` table. All the data in the column will be lost.
  - You are about to drop the column `ethereumAddress` on the `UnsubmittedProfile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `UnsubmittedProfile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `UnsubmittedProfile` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UnsubmittedProfile_ethereumAddress_key";

-- AlterTable
ALTER TABLE "UnsubmittedProfile" DROP COLUMN "email",
DROP COLUMN "ethereumAddress",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "ethereumAddress" TEXT NOT NULL,
    "profileId" INTEGER,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_ethereumAddress_key" ON "User"("ethereumAddress");

-- CreateIndex
CREATE UNIQUE INDEX "User_profileId_key" ON "User"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "UnsubmittedProfile_userId_key" ON "UnsubmittedProfile"("userId");

-- AddForeignKey
ALTER TABLE "UnsubmittedProfile" ADD CONSTRAINT "UnsubmittedProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "CachedProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
