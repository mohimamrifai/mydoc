-- CreateEnum
CREATE TYPE "StatusMedical" AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE');

-- CreateTable
CREATE TABLE "MedicalStaffInfo" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "credentials" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "institutionName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "StatusMedical" NOT NULL DEFAULT 'PENDING',
    "userId" TEXT NOT NULL,

    CONSTRAINT "MedicalStaffInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MedicalStaffInfo_username_key" ON "MedicalStaffInfo"("username");

-- CreateIndex
CREATE UNIQUE INDEX "MedicalStaffInfo_userId_key" ON "MedicalStaffInfo"("userId");

-- AddForeignKey
ALTER TABLE "MedicalStaffInfo" ADD CONSTRAINT "MedicalStaffInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
