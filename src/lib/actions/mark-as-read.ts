"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
export async function markAsRead(id: string | string[]) {
    try {
        if (!id) {
            throw new Error("Notification ID is required");
        }

        if (Array.isArray(id)) {
            // Handle array of IDs
            const result = await prisma.notification.updateMany({
                where: {
                    id: {
                        in: id
                    }
                },
                data: {
                    isRead: true
                }
            });

            revalidatePath("/medical-staff/notifications");
            return { success: true, message: "Notifications marked as read successfully" };
        } else {
            // Handle single ID
            const result = await prisma.notification.update({
                where: { id },
                data: {
                    isRead: true
                }
            });

            return { success: true, message: "Notification marked as read successfully" };
        }
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Failed to mark notification(s) as read");
    }
}
