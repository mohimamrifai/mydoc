"use server";

import { z } from "zod";
import { formCreateProductMedicalStaffSchema } from "@/components/forms/form-create-product-medical-staff";
import { uploadMainVideo } from "./upload-main-video";
import { uploadThumbnailVideo } from "./upload-thumbnail-video";
import { uploadPreviewVideo } from "./upload-preview-video";
import { ResponseServerActionType } from "../respon-server-action";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function createProductMedicalStaff(
    values: z.infer<typeof formCreateProductMedicalStaffSchema>,
    formData: FormData
): Promise<ResponseServerActionType> {
    try {
        // Get session
        const session = await auth();
        if (!session?.user?.id) {
            return { status: "error", message: "Unauthorized access - please log in" };
        }

        // Verify user exists in database
        try {
            const user = await prisma.user.findUnique({
                where: { id: session.user.id },
                select: { id: true }
            });
            
            if (!user) {
                return { status: "error", message: "Invalid user account" };
            }
        } catch (userError) {
            return { status: "error", message: "Failed to verify user" };
        }

        // Upload files
        let videoUrl = "";
        let videoPreviewUrl = "";
        let thumbnailUrl = "";

        try {
            const videoFile = formData.get("video") as File;
            if (videoFile) videoUrl = await uploadMainVideo(videoFile);
            
            
            const videoPreviewFile = formData.get("videoPreview") as File;
            if (videoPreviewFile) videoPreviewUrl = await uploadPreviewVideo(videoPreviewFile);
            
            const thumbnailFile = formData.get("thumbnail") as File;
            if (thumbnailFile) thumbnailUrl = await uploadThumbnailVideo(thumbnailFile);
        } catch (uploadError) {
            return { status: "error", message: "Error uploading files" };
        }
        
        // Extract other form values
        const { title, description, categoryId, price, subCategorieIds } = values;
        
        // Verify category exists
        try {
            const category = await prisma.category.findUnique({
                where: { id: categoryId },
                select: { id: true }
            });
            
            if (!category) {
                return { status: "error", message: "Invalid category" };
            }
        } catch (categoryError) {
            return { status: "error", message: "Failed to verify category" };
        }
        
        try {
            // Create database record
            const result = await prisma.video.create({
                data: {
                    title: title,
                    description: description,
                    status: "PENDING",
                    videoUrl: videoUrl,
                    videoPreviewUrl: videoPreviewUrl,
                    thumbnailUrl: thumbnailUrl,
                    uploadedById: session.user.id,
                    categoryId: categoryId,
                    subCategorieIds: subCategorieIds,
                    price: price
                }
            });

            await prisma.notification.create({
                data: {
                    title: "Video Baru",
                    message: `Video baru telah dibuat oleh ${session.user.name}`,
                    userId: session.user.id
                }
            })
            
            return { 
                status: "success", 
                message: "Product created successfully", 
                data: { id: result.id } 
            };
        } catch (dbError: any) {
            return { 
                status: "error", 
                message: `Database error: ${dbError?.message || "Unknown error"}` 
            };
        }
    } catch (error) {
        return { status: "error", message: "Unexpected error" };
    }
}
