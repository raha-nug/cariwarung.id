/*
  Warnings:

  - You are about to drop the column `coverImageUrl` on the `warung` table. All the data in the column will be lost.
  - Added the required column `coverImage` to the `Warung` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `warung` DROP COLUMN `coverImageUrl`,
    ADD COLUMN `coverImage` VARCHAR(191) NOT NULL;
