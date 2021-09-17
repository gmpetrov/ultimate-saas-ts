-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "cancel_at" TIMESTAMP(3),
ADD COLUMN     "cancel_at_period_end" BOOLEAN,
ADD COLUMN     "canceled_at" TIMESTAMP(3);
