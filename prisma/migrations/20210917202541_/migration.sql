/*
  Warnings:

  - You are about to drop the column `stripe_customer_id` on the `customers` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `customers` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "subscriptions_user_id_unique";

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "stripe_customer_id",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
