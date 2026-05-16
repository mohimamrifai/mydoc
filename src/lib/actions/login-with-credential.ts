"use server"

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { ResponseServerAction } from "../respon-server-action";

export async function loginWithCredential(email: string, password: string) {
    try {
        await signIn("credentials", { 
            email, 
            password,
            redirect: false // Prevent automatic redirect to allow custom handling
        });
        
        return ResponseServerAction({
            status: "success",
            message: "Login berhasil",
        })
    } catch (error) {
        if (error instanceof AuthError) {
            const message = error.cause?.err?.message
            return ResponseServerAction({
                status: "error",
                message: message || "Terjadi kesalahan saat login",
            })
        }
        return ResponseServerAction({
            status: "error",
            message: "Login gagal, Periksa kembali kredensial Anda",
        })
    }
}
