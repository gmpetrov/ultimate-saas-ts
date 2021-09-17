/*
  Warnings:

  - You are about to drop the column `created_at` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `provider_account_id` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `session_token` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `sessions` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `email_verified` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `users` table. All the data in the column will be lost.
  - The primary key for the `verification_requests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_at` on the `verification_requests` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `verification_requests` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `verification_requests` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider,providerAccountId]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sessionToken]` on the table `sessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `providerAccountId` to the `accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sessionToken` to the `sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `sessions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_user_id_fkey";

-- DropForeignKey
ALTER TABLE "sessions" DROP CONSTRAINT "sessions_user_id_fkey";

-- DropIndex
DROP INDEX "accounts_provider_provider_account_id_key";

-- DropIndex
DROP INDEX "sessions_session_token_key";

-- DropIndex
DROP INDEX "subscriptions_user_id_unique";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "created_at",
DROP COLUMN "provider_account_id",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "providerAccountId" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "sessions" DROP COLUMN "created_at",
DROP COLUMN "session_token",
DROP COLUMN "updated_at",
DROP COLUMN "user_id",
ADD COLUMN     "sessionToken" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "created_at",
DROP COLUMN "email_verified",
DROP COLUMN "updated_at",
ADD COLUMN     "emailVerified" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "verification_requests" DROP CONSTRAINT "verification_requests_pkey",
DROP COLUMN "created_at",
DROP COLUMN "id",
DROP COLUMN "updated_at";

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
