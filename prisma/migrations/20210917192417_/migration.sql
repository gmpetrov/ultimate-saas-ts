/*
  Warnings:

  - You are about to drop the column `provider` on the `accounts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider_id,provider_account_id]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `provider_id` to the `accounts` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "accounts_provider_provider_account_id_key";

-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "provider",
ADD COLUMN     "provider_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_id_provider_account_id_key" ON "accounts"("provider_id", "provider_account_id");
