-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "cancelledAt" TIMESTAMP(3),
ADD COLUMN     "pausedFrom" TIMESTAMP(3),
ADD COLUMN     "pausedUntil" TIMESTAMP(3);
