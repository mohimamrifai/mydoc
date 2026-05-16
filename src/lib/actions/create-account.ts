"use server"
import { prisma } from "@/lib/prisma"
import { Role } from "@prisma/client"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
interface dataProps {
    name: string
    email: string
    password: string
    role: Role
}

export const createAccount = async (data: dataProps) => {
    try {
        const { name, email, password, role } = data

        // Validate name
        if (!name || name.trim().length === 0) {
            return { success: false, message: "Name is required" }
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return { success: false, message: "Invalid email format" }
        }

        // Check if email already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })
        if (existingUser) {
            return { success: false, message: "Email already registered" }
        }

        // Validate password length
        if (password.length < 8) {
            return { success: false, message: "Password must be at least 8 characters" }
        }

        // Validate role
        const validRoles = ["ADMINISTRATOR", "ADMIN", "MEDICAL_STAFF", "CUSTOMER"]
        if (!validRoles.includes(role)) {
            return { success: false, message: "Invalid role" }
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const result = await prisma.user.create({
            data: {
                name: name,
                email: email,
                password: hashedPassword,
                role: role
            }
        })
        revalidatePath("/admin/list/medical-staff")
        return { success: true, message: "Account created successfully" }
    } catch (error) {
        return { success: false, message: "Failed to create account" }
    }
}
