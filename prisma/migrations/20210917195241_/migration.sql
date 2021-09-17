/*
  Warnings:

  - You are about to drop the column `provider_id` on the `accounts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider,provider_account_id]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `provider` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "accounts_provider_id_provider_account_id_key";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "provider_id",
ADD COLUMN     "provider" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_provider_account_id_key" ON "accounts"("provider", "provider_account_id");
