"use server"

import { Role } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export const deleteAccount = async (id: string, role: Role) => {
    try {
        // Validate ID
        if (!id || id.trim().length === 0) {
            return { success: false, message: "ID is required" }
        }

        // Validate role
        const validRoles = ["ADMINISTRATOR", "ADMIN", "MEDICAL_STAFF", "CUSTOMER"]
        if (!validRoles.includes(role)) {
            return { success: false, message: "Invalid role" }
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { id }
        })
        if (!existingUser) {
            return { success: false, message: "User not found" }
        }

        // Check if user role matches
        if (existingUser.role !== role) {
            return { success: false, message: "User role does not match" }
        }

        const user = await prisma.user.delete({
            where: { id }
        })

        revalidatePath("/admin/list/medical-staff")
        return { success: true, message: "Account deleted successfully" }

    } catch (error) {
        return { success: false, message: "Failed to delete account" }
    }
}
