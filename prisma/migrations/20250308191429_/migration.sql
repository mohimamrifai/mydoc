/*
  Warnings:

  - You are about to drop the column `subCategorieIds` on the `Video` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "subCategorieIds";

-- CreateTable
CREATE TABLE "_SubCategoryToVideo" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_SubCategoryToVideo_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_SubCategoryToVideo_B_index" ON "_SubCategoryToVideo"("B");

-- AddForeignKey
ALTER TABLE "_SubCategoryToVideo" ADD CONSTRAINT "_SubCategoryToVideo_A_fkey" FOREIGN KEY ("A") REFERENCES "SubCategory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_SubCategoryToVideo" ADD CONSTRAINT "_SubCategoryToVideo_B_fkey" FOREIGN KEY ("B") REFERENCES "Video"("id") ON DELETE CASCADE ON UPDATE CASCADE;
