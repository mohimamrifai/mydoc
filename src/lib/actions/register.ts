"use server";

import bcrypt from "bcryptjs";
import { ResponseServerAction } from "../respon-server-action";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export const register = async (data: { name: string, email: string, password: string, role?: Role }) => {
    try {
        const { name, email, password, role } = data;
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            return ResponseServerAction({ status: "error", message: "Email sudah terdaftar" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || "CUSTOMER",
            }
        });
        return ResponseServerAction({ status: "success", message: "Berhasil membuat akun", data: user });
    } catch (error) {
        return ResponseServerAction({ status: "error", message: "Terjadi kesalahan" });
    }
};
