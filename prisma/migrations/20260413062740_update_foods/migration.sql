/*
  Warnings:

  - Added the required column `stock` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Food` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FoodType" AS ENUM ('MAINCOURSE', 'DESSERT', 'APPETIZER');

-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "stock" INTEGER NOT NULL,
ADD COLUMN     "type" "FoodType" NOT NULL;
