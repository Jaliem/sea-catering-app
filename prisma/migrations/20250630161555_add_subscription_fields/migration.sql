/*
  Warnings:

  - You are about to drop the column `email` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `phone` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `plan` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Subscription_email_key";

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "email",
ADD COLUMN     "allergies" TEXT,
ADD COLUMN     "deliveryDays" TEXT[],
ADD COLUMN     "mealTypes" TEXT[],
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "plan" TEXT NOT NULL;
