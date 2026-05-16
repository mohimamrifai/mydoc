"use server";

import { ResponseServerAction } from "../respon-server-action";
import { prisma } from "@/lib/prisma";

interface UpdateInfoMedicalProps {
    username: string;
    phone: string;
    address: string;
    specialization: string;
    credentials: string;
    experience: string;
    institutionName: string;
    status: "PENDING" | "ACTIVE" | "INACTIVE";
    userId: string;
}

export const updateInfoMedical = async ({
    username,
    phone,
    address,
    specialization,
    credentials,
    experience,
    institutionName,
    status,
    userId
}: UpdateInfoMedicalProps) => {
    try {
        // Check if user is medical staff
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user || user.role !== "MEDICAL_STAFF") {
            return ResponseServerAction({
                status: "error",
                message: "Hanya tenaga medis yang dapat mengakses fitur ini"
            });
        }

        const existingUsername = await prisma.medicalStaffInfo.findUnique({
            where: { username }
        });

        if (existingUsername) {
            return ResponseServerAction({ 
                status: "error", 
                message: "Username sudah digunakan" 
            });
        }

        const medicalStaffInfo = await prisma.medicalStaffInfo.create({
            data: {
                username,
                phone,
                address,
                specialization,
                credentials,
                experience,
                institutionName,
                status,
                userId: userId
            }
        });

        return ResponseServerAction({ 
            status: "success", 
            message: "Informasi tenaga medis berhasil ditambahkan" 
        });

    } catch (error) {
        return ResponseServerAction({ 
            status: "error", 
            message: "Terjadi kesalahan saat menambahkan informasi" 
        });
    }
};