/*
  Warnings:

  - You are about to drop the `Logo` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Logo";

-- CreateTable
CREATE TABLE "GeneralSetting" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL DEFAULT '/logo.png',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GeneralSetting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GeneralSetting_companyName_key" ON "GeneralSetting"("companyName");

-- CreateIndex
CREATE UNIQUE INDEX "GeneralSetting_email_key" ON "GeneralSetting"("email");

-- CreateIndex
CREATE UNIQUE INDEX "GeneralSetting_logoUrl_key" ON "GeneralSetting"("logoUrl");
