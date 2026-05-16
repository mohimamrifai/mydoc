"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
export async function deleteNotification(id: string | string[]) {
    try {
        if (!id) {
            throw new Error("Notification ID is required");
        }

        if (Array.isArray(id)) {
            // Handle array of IDs
            const result = await prisma.notification.deleteMany({
                where: {
                    id: {
                        in: id
                    }
                }
            });
            revalidatePath("/medical-staff/notifications");
            return { success: true, message: "Notifications deleted successfully" };
        } else {
            // Handle single ID
            const result = await prisma.notification.delete({
                where: { id }
            });

            return { success: true, message: "Notification deleted successfully" };
        }
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Failed to delete notification(s)");
    }
}
