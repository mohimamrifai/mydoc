/*
  Warnings:

  - You are about to drop the `_SubCategoryToVideo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_SubCategoryToVideo" DROP CONSTRAINT "_SubCategoryToVideo_A_fkey";

-- DropForeignKey
ALTER TABLE "_SubCategoryToVideo" DROP CONSTRAINT "_SubCategoryToVideo_B_fkey";

-- AlterTable
ALTER TABLE "Video" ADD COLUMN     "subCategorieIds" TEXT[],
ADD COLUMN     "subCategoryId" TEXT;

-- DropTable
DROP TABLE "_SubCategoryToVideo";

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
