/*
  Warnings:

  - You are about to drop the `VideoSubCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "VideoSubCategory" DROP CONSTRAINT "VideoSubCategory_subCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "VideoSubCategory" DROP CONSTRAINT "VideoSubCategory_videoId_fkey";

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "subCategorieIds" INTEGER[];

-- DropTable
DROP TABLE "VideoSubCategory";
