"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { auth } from "@/auth";
import { uploadProfileImage } from "@/lib/actions/upload-profile";
import { revalidatePath } from "next/cache";

// Schema validasi untuk data profil
const profileSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    password: z.string().optional(),
    image: z.string().optional(),
    username: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    specialization: z.string().optional(),
    credentials: z.string().optional(),
    experience: z.string().optional(),
    institutionName: z.string().optional()
}).refine((data) => {
    if (data.currentPassword || data.newPassword) {
        return data.currentPassword && data.newPassword;
    }
    return true;
}, {
    message: "Both current and new password are required to change password"
}).refine((data) => {
    if (data.newPassword) {
        return data.newPassword.length >= 8;
    }
    return true;
}, {
    message: "New password must be at least 8 characters"
});

export async function updateProfile(formData: FormData) {
    try {
        const session = await auth();
        
        if (!session) {
            throw new Error("Unauthorized");
        }

        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const currentPassword = formData.get("currentPassword") as string;
        const newPassword = formData.get("newPassword") as string;
        const imageFile = formData.get("image") as File;
        const username = formData.get("username") as string;
        const phone = formData.get("phone") as string;
        const address = formData.get("address") as string;
        const specialization = formData.get("specialization") as string;
        const credentials = formData.get("credentials") as string;
        const experience = formData.get("experience") as string;
        const institutionName = formData.get("institutionName") as string;

        // Validasi field yang wajib diisi
        if (!name || !email) {
            throw new Error("Name and email are required");
        }

        const user = session.user;

        const userData = await prisma.user.findUnique({
            where: {
                id: user.id,
            },
            include: {
                medicalStaffInfo: true
            }
        });

        if (!userData) {
            throw new Error("User not found");
        }

        // Persiapkan data yang akan diupdate
        const updateData: any = {
            name,
            email
        };

        // Handle upload gambar jika ada
        if (imageFile && imageFile.size > 0) {
            if (!imageFile.type.startsWith("image/")) {
                throw new Error("File must be an image");
            }
            const imageUrl = await uploadProfileImage(imageFile);
            updateData.image = imageUrl;
        }

        // Handle update password jika ada
        if (currentPassword && newPassword) {
            // Verifikasi password lama
            const isPasswordValid = await bcrypt.compare(currentPassword, userData.password as string);
            if (!isPasswordValid) {
                throw new Error("Current password is incorrect");
            }

            // Hash password baru dan masukkan ke updateData
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updateData.password = hashedPassword;
        }

        // Validasi data dengan schema
        const validatedData = profileSchema.parse(updateData);

        // Update data user di database
        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: validatedData
        });

        // Update medical staff info if exists
        if (userData.medicalStaffInfo) {
            await prisma.medicalStaffInfo.update({
                where: {
                    userId: user.id
                },
                data: {
                    username,
                    phone,
                    address,
                    specialization,
                    credentials,
                    experience,
                    institutionName
                }
            });
        }

        revalidatePath(`/${userData.role.toLowerCase()}/profile`);
        return { status: "success", message: "Profile updated successfully" };

    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(error.errors[0].message);
        }
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Failed to update profile");
    }
}
