/*
  Warnings:

  - Added the required column `eurRate` to the `Calculation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eurRateUpdated` to the `Calculation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `laborCostInEUR` to the `Calculation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Calculation" ADD COLUMN     "eurRate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "eurRateUpdated" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "laborCostInEUR" DOUBLE PRECISION NOT NULL;
