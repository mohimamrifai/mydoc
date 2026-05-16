"use server";

import { prisma } from "@/lib/prisma";
import { ResponseServerAction } from "../respon-server-action";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function forgotPassword(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (!user) {
            return ResponseServerAction({
                status: "error",
                message: "Email Belum Terdaftar"
            })
        }

        // Buat token unik
        const token = crypto.randomBytes(32).toString("hex");
        const tokenExpires = new Date();
        tokenExpires.setHours(tokenExpires.getHours() + 1); // Berlaku 1 jam

        // Simpan token ke database
        await prisma.session.create({
            data: {
                sessionToken: token,
                userId: user.id,
                expires: tokenExpires
            }
        })

        // Kirim email dengan link reset password
        const resetLink = `http://localhost:3000/reset-password?token=${token}`;
        const emailContent = `
        Klik tautan berikut untuk mereset password:
        ${resetLink}
        `

        const transporter = nodemailer.createTransport({
            host: "localhost",
            port: 1025, // Port default MailHog
            secure: false
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Reset Password",
            text: emailContent
        })

        return ResponseServerAction({
            status: "success",
            message: "Link reset password berhasil dikirim ke email Anda"
        })


    } catch (error) {
        return ResponseServerAction({
            status: "error",
            message: "Terjadi kesalahan saat mengirim email reset password"
        })
    }
}
