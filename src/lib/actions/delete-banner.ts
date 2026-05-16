"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const deleteBanner = async (id: string) => {
    try {
        // Delete banner from database
        await prisma.banner.delete({
            where: { id }
        });

        revalidatePath("/admin/list/banners");
        return { status: "success", message: "Banner deleted successfully" };
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Failed to delete banner");
    }
}
