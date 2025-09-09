/*
  Warnings:

  - You are about to drop the column `avatarUrl` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `maxAgeInterest` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `minAgeInterest` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Profile` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `full_name` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropIndex
DROP INDEX "public"."Profile_userId_key";

-- AlterTable
ALTER TABLE "public"."Profile" DROP COLUMN "avatarUrl",
DROP COLUMN "createdAt",
DROP COLUMN "deletedAt",
DROP COLUMN "fullName",
DROP COLUMN "maxAgeInterest",
DROP COLUMN "minAgeInterest",
DROP COLUMN "updatedAt",
DROP COLUMN "userId",
ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMP(3),
ADD COLUMN     "full_name" TEXT NOT NULL,
ADD COLUMN     "max_age_interest" INTEGER,
ADD COLUMN     "min_age_interest" INTEGER,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Profile_user_id_key" ON "public"."Profile"("user_id");

-- AddForeignKey
ALTER TABLE "public"."Profile" ADD CONSTRAINT "Profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
