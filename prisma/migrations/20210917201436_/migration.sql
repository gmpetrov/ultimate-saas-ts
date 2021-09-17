/*
  Warnings:

  - You are about to drop the column `providerAccountId` on the `accounts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider,provider_account_id]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `provider_account_id` to the `accounts` table without a default value. This is not possible if the table is not empty.
  - The required column `id` was added to the `verification_requests` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "accounts_provider_providerAccountId_key";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "providerAccountId",
ADD COLUMN     "provider_account_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "verification_requests" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "verification_requests_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");
