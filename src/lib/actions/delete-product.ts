"use server";

import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function deleteProduct(id: string) {
    const session = await auth();
    if (!session) {
        return { status: "error", message: "Unauthorized" };
    }
    try {
        // Find the product to get file paths
        const product = await prisma.video.findUnique({ where: { id } });
        if (!product) {
            return { status: "error", message: "Product not found" };
        }

        // Delete the product from the database
        await prisma.video.delete({ where: { id } });

        // Define file paths
        const mainVideoPath = path.join(process.cwd(), "src/assets/main-video", path.basename(product.videoUrl || ""));
        const previewVideoPath = path.join(process.cwd(), "src/assets/video-previews", path.basename(product.videoPreviewUrl || ""));
        const thumbnailPath = path.join(process.cwd(), "src/assets/thumbnails", path.basename(product.thumbnailUrl || ""));

        // Delete files
        if (fs.existsSync(mainVideoPath)) fs.unlinkSync(mainVideoPath);
        if (fs.existsSync(previewVideoPath)) fs.unlinkSync(previewVideoPath);
        if (fs.existsSync(thumbnailPath)) fs.unlinkSync(thumbnailPath);

        revalidatePath(`/${session?.user.role}/products`);
        return { status: "success", message: "Product and associated files deleted successfully" };
    } catch (error) {
        return { status: "error", message: "Failed to delete product" };
    }
}
