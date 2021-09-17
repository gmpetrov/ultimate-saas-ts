/*
  Warnings:

  - The values [TRIALING,ACTIVE,CANCELED,INCOMPLETE,INCOMPLETE_EXPIRED,PAST_DUE,UNPAID] on the enum `SubscriptionStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SubscriptionStatus_new" AS ENUM ('active', 'canceled', 'incomplete', 'incomplete_expired', 'past_due', 'trialing', 'unpaid');
ALTER TABLE "subscriptions" ALTER COLUMN "status" TYPE "SubscriptionStatus_new" USING ("status"::text::"SubscriptionStatus_new");
ALTER TYPE "SubscriptionStatus" RENAME TO "SubscriptionStatus_old";
ALTER TYPE "SubscriptionStatus_new" RENAME TO "SubscriptionStatus";
DROP TYPE "SubscriptionStatus_old";
COMMIT;

-- DropEnum
DROP TYPE "PricingPlan";
