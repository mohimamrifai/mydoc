"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { BannerStatus } from "@prisma/client";
import { uploadBannerImage } from "./upload-banner";
import { revalidatePath } from "next/cache";

const bannerSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    imageUrl: z.string().optional(),
    status: z.nativeEnum(BannerStatus)
});

export const updateBanner = async (id: string, data: FormData) => {
    try {
        const title = data.get("title") as string;
        const description = data.get("description") as string;
        const status = data.get("status") as BannerStatus;
        const imageFile = data.get("image") as File;

        // Validate required fields
        if (!title || !description) {
            throw new Error("Title and description are required");
        }

        let imageUrl;
        if (imageFile && imageFile.size > 0) {
            // Validate file type
            if (!imageFile.type.startsWith("image/")) {
                throw new Error("File must be an image");
            }
            // Upload new image and get filename
            imageUrl = await uploadBannerImage(imageFile);
        }

        // Prepare update data
        const updateData = {
            title,
            description,
            status: status || BannerStatus.ACTIVE
        };

        if (imageUrl) {
            Object.assign(updateData, { imageUrl });
        }

        // Validate data with schema
        const validatedData = bannerSchema.partial().parse(updateData);

        // Update banner in database
        const banner = await prisma.banner.update({
            where: { id },
            data: validatedData
        });

        revalidatePath("/admin/list/banners");
        return { status: "success", message: "Banner updated successfully" };
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(error.errors[0].message);
        }
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Failed to update banner");
    }
}
