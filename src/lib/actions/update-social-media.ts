"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";

const socialMediaSchema = z.array(
  z.object({
    name: z.enum(["facebook", "twitter", "instagram", "youtube", "linkedin"]),
    url: z.string().url("Invalid URL format")
  })
);

export async function updateSocialMedia(socialMediaData: z.infer<typeof socialMediaSchema>) {
  try {
    // Validate input data
    const validatedData = socialMediaSchema.parse(socialMediaData);

    // Update all social media entries
    const updatePromises = validatedData.map(async (social) => {
      return prisma.socialMedia.upsert({
        where: {
          name: social.name
        },
        update: {
          url: social.url
        },
        create: {
          name: social.name,
          url: social.url
        }
      });
    });

    await Promise.all(updatePromises);

    return { status: "success", message: "Social media settings updated successfully" };

  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "error", message: "Invalid social media data format" };
    }
    return { status: "error", message: "Failed to update social media settings" };
  }
}
