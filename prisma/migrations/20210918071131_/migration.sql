/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `customers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "customers_user_id_unique" ON "customers"("user_id");
