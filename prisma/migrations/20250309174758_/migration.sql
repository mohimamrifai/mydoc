/*
  Warnings:

  - You are about to drop the column `videoReviewUrl` on the `Video` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Video" DROP COLUMN "videoReviewUrl",
ADD COLUMN     "videoPreviewUrl" TEXT;
