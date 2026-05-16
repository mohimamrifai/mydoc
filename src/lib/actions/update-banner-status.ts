"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateBannerStatus(bannerId: string, status: string) {
  try {
    // Validate status
    if (!status || !['ACTIVE', 'INACTIVE'].includes(status)) {
      return { status: "error", message: "Invalid banner status" };
    }

    // Check if banner exists
    const existingBanner = await prisma.banner.findUnique({
      where: { id: bannerId }
    });

    if (!existingBanner) {
      return { status: "error", message: "Banner not found" };
    }

    // Update banner status
    await prisma.banner.update({
      where: { id: bannerId },
      data: {
        status: status as 'ACTIVE' | 'INACTIVE'
      }
    });

    revalidatePath("/admin/list/banners");
    return { status: "success", message: "Banner status updated successfully" };

  } catch (error) {
    return { status: "error", message: "Failed to update banner status" };
  }
}
