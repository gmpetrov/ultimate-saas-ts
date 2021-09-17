-- AlterTable
ALTER TABLE "subscriptions" ADD COLUMN     "ended_at" TIMESTAMP(3),
ADD COLUMN     "start_date" TIMESTAMP(3),
ADD COLUMN     "trial_end" TIMESTAMP(3),
ADD COLUMN     "trial_start" TIMESTAMP(3);
