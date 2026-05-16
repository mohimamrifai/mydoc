"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { uploadLogo } from "./upload-logo";

const generalSettingSchema = z.object({
    companyName: z.string().min(1, "Company name is required"),
    address: z.string().min(1, "Address is required"), 
    phone: z.string().min(1, "Phone is required"),
    email: z.string().email("Invalid email address"),
    logoUrl: z.string().optional()
});

export async function updateGeneralSetting(data: FormData) {
    try {
        const companyName = data.get("companyName") as string;
        const address = data.get("address") as string;
        const phone = data.get("phone") as string;
        const email = data.get("email") as string;
        const logoFile = data.get("logo") as File;

        if (!companyName || !address || !phone || !email) {
            throw new Error("All fields are required");
        }

        let logoUrl;
        if (logoFile && logoFile.size > 0) {
            if (!logoFile.type.startsWith("image/")) {
                throw new Error("Logo file must be an image");
            }
            logoUrl = await uploadLogo(logoFile);
        }

        const updateData = {
            companyName,
            address,
            phone,
            email
        };

        if (logoUrl) {
            Object.assign(updateData, { logoUrl });
        }

        const validatedData = generalSettingSchema.parse(updateData);

        const existingSetting = await prisma.generalSetting.findFirst();

        const setting = existingSetting 
            ? await prisma.generalSetting.update({
                where: { id: existingSetting.id },
                data: validatedData
            })
            : await prisma.generalSetting.create({
                data: validatedData
            });

        return { status: "success", message: "General settings updated successfully" };

    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(error.errors[0].message);
        }
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Failed to update general settings");
    }
}
