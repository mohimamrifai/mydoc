"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteVideo(id: string, title: string) {
    try {
        // Validate video exists
        const existingVideo = await prisma.video.findUnique({
            where: { id },
            include: {
                uploadedBy: true
            }
        });

        if (!existingVideo) {
            throw new Error("Video not found");
        }

        // Delete the video
        const video = await prisma.video.delete({ where: { id } });

        // Create notification for video owner
        await prisma.notification.create({
            data: {
                title: "Video Deleted",
                message: `Your video "${title}" has been deleted by an administrator.`,
                userId: existingVideo.uploadedBy.id
            }
        });

        revalidatePath("/admin/list/products");
        return { success: true, message: "Video deleted successfully" };
    } catch (error) {
        throw error;
    }
}
