"use server";

import { VideoStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateStatusVideo(id: string, status: VideoStatus, message: string) {
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

        // Validate status transition
        if (status === VideoStatus.REJECTED && !message) {
            throw new Error("Rejection message is required");
        }

        // Update video status
        const video = await prisma.video.update({
            where: { id },
            data: { status, message }
        });

        // Create notification based on status
        let notificationTitle = "";
        let notificationMessage = "";

        if (status === VideoStatus.APPROVED) {
            notificationTitle = "Video Approved";
            notificationMessage = "Your video has been approved and is now live.";
        } else if (status === VideoStatus.REJECTED) {
            notificationTitle = "Video Rejected";
            notificationMessage = `Your video was rejected. Reason: ${message}`;
        }

        // Send notification to video owner
        if (notificationTitle) {
            await prisma.notification.create({
                data: {
                    title: notificationTitle,
                    message: notificationMessage,
                    userId: existingVideo.uploadedBy.id
                }
            });
        }

        revalidatePath("/admin/list/products");
        return video;
    } catch (error) {
        throw error;
    }
}
