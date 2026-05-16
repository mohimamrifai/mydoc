"use server";

import { z } from "zod";
import { formUpdateProductMedicalStaffSchema } from "@/components/forms/form-update-product-medical-staff";
import { uploadMainVideo } from "./upload-main-video";
import { uploadThumbnailVideo } from "./upload-thumbnail-video";
import { uploadPreviewVideo } from "./upload-preview-video";
import { ResponseServerActionType } from "../respon-server-action";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

interface UploadResult {
    filename: string;
    duration: number;
}

export async function updateProductMedicalStaff(
    id: string,
    values: z.infer<typeof formUpdateProductMedicalStaffSchema>,
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
        let videoUrl = values.videoUrl;
        let videoPreviewUrl = values.videoPreviewUrl;
        let thumbnailUrl = values.thumbnailUrl;
        let videoDuration = 0;
        
        try {
            const videoFile = formData.get("video") as File;
            if (videoFile) {
                const result = await uploadMainVideo(videoFile);
                if (result && typeof result === 'object' && 'filename' in result && 'duration' in result) {
                    const uploadResult = result as UploadResult;
                    videoUrl = uploadResult.filename;
                    videoDuration = uploadResult.duration;
                } else {
                    videoUrl = result as string;
                }
            }
            
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
            // Update database record
            const result = await prisma.video.update({
                where: { id: id },
                data: {
                    title: title,
                    description: description,
                    status: "PENDING",
                    videoUrl: videoUrl,
                    videoPreviewUrl: videoPreviewUrl,
                    thumbnailUrl: thumbnailUrl,
                    uploadedById: session.user.id,
                    categoryId: categoryId,
                    subCategorieIds: subCategorieIds, // Replace with updated subCategorieIds
                    price: price
                }
            });
            
            return { 
                status: "success", 
                message: "Product updated successfully", 
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
