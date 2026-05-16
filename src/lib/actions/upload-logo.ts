"use server";

import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

export async function uploadLogo(logoFile: File) {
    if (!logoFile || logoFile.size === 0) {
        throw new Error("Invalid or empty logo file");
    }

    try {
        const bytes = await logoFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const timestamp = Date.now();
        const cleanName = logoFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}-${cleanName}`;
        
        const assetsDir = path.join(process.cwd(), "src/assets");
        const uploadDir = path.join(assetsDir, "logos");
        
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        return filename;
    } catch (error: any) {
        throw new Error("Failed to upload logo image");
    }
}
