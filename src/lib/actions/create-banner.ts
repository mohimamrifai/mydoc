"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { BannerStatus } from "@prisma/client";
import { uploadBannerImage } from "./upload-banner";
import { revalidatePath } from "next/cache";

const bannerSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"), 
    imageUrl: z.string().min(1, "Image is required"),
    status: z.nativeEnum(BannerStatus).default(BannerStatus.ACTIVE)
});

export const createBanner = async (data: FormData) => {
    try {
        const title = data.get("title") as string;
        const description = data.get("description") as string;
        const status = data.get("status") as BannerStatus;
        const imageFile = data.get("image") as File;

        // Validate required fields
        if (!title || !description) {
            throw new Error("Title and description are required");
        }

        if (!imageFile) {
            throw new Error("Image is required");
        }

        // Validate file type
        if (!imageFile.type.startsWith("image/")) {
            throw new Error("File must be an image");
        }

        // Upload image and get filename
        const filename = await uploadBannerImage(imageFile);

        // Validate data with schema
        const validatedData = bannerSchema.parse({
            title,
            description,
            imageUrl: filename, // Use the returned filename
            status: status || BannerStatus.ACTIVE // Default to ACTIVE if not provided
        });

        // Create banner in database
        const banner = await prisma.banner.create({
            data: validatedData
        });

        revalidatePath("/admin/list/banners");
        return { status: "success", message: "Banner created successfully" };
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(error.errors[0].message);
        }
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Failed to create banner");
    }
}
