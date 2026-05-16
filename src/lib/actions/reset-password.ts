"use server";

import { prisma } from "@/lib/prisma";
import { ResponseServerAction } from "../respon-server-action";
import bcrypt from "bcryptjs";

export async function resetPassword(token: string | null, newPassword: string) {
    if (!token) {
        return ResponseServerAction({
            status: "error",
            message: "Token tidak valid"
        });
    }

    try {
        const session = await prisma.session.findUnique({
            where: {
                sessionToken: token
            },
            include: {
                user: true
            }
        });

        if (!session || session.expires < new Date()) {
            return ResponseServerAction({
                status: "error",
                message: "Token tidak valid atau telah kedaluwarsa"
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: {
                id: session.userId
            },
            data: {
                password: hashedPassword
            }
        });

        await prisma.session.delete({
            where: {
                sessionToken: token
            }
        });

        return ResponseServerAction({
            status: "success",
            message: "Password berhasil direset"
        });

    } catch (error) {
        return ResponseServerAction({
            status: "error",
            message: "Terjadi kesalahan saat mereset password"
        });
    }
}
