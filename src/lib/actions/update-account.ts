"use server"
import { prisma } from "@/lib/prisma"
import { Role, StatusMedical } from "@prisma/client"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

interface dataProps {
    name: string
    email: string
    newPassword?: string
    role: Role,
    statusAkun?: StatusMedical
}

export const updateAccount = async (id: string, data: dataProps) => {
    try {
        const { name, email, newPassword, role, statusAkun } = data
        let password = undefined

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
        const existingUser = await prisma.user.findFirst({
            where: {
                email,
                NOT: {
                    id
                }
            }
        })
        if (existingUser) {
            return { success: false, message: "Email already registered" }
        }

        // Only hash and update password if newPassword is provided and not empty
        if (newPassword) {
            if (newPassword.length < 8) {
                return { success: false, message: "Password must be at least 8 characters" }
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10)
            password = hashedPassword
        }

        // Validate role
        const validRoles = ["ADMINISTRATOR", "ADMIN", "MEDICAL_STAFF", "CUSTOMER"]
        if (!validRoles.includes(role)) {
            return { success: false, message: "Invalid role" }
        }

        // Create update data object without password if not changing it
        const updateData: any = {
            name,
            email,
            role
        }
        
        // Only include password in update if it's being changed
        if (password) {
            updateData.password = password
        }

        // Update user
        const result = await prisma.user.update({
            where: { id },
            data: updateData
        })

        // If role is MEDICAL_STAFF, only update status in medical staff info
        if (role === "MEDICAL_STAFF" && statusAkun) {
            const existingMedicalStaff = await prisma.medicalStaffInfo.findUnique({
                where: { userId: id }
            })

            if (existingMedicalStaff) {
                await prisma.medicalStaffInfo.update({
                    where: { userId: id },
                    data: {
                        status: statusAkun
                    }
                })
            }
        }

        revalidatePath("/admin/list/medical-staff")
        return { success: true, message: "Account updated successfully" }
    } catch (error) {
        return { success: false, message: "Failed to update account" }
    }
}
