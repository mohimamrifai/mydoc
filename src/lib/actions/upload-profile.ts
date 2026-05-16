"use server";

import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

export async function uploadProfileImage(imageFile: File) {
    if (!imageFile || imageFile.size === 0) {
        throw new Error("Invalid or empty image file");
    }

    try {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const timestamp = Date.now();
        const cleanName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}-${cleanName}`;
        
        const assetsDir = path.join(process.cwd(), "src/assets");
        const uploadDir = path.join(assetsDir, "profiles");
        
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        return filename;
    } catch (error: any) {
        throw new Error("Failed to upload profile image");
    }
}
