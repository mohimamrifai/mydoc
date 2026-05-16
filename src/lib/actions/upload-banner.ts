"use server";

import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

export async function uploadBannerImage(bannerFile: File) {
    if (!bannerFile || bannerFile.size === 0) {
        throw new Error("Invalid or empty banner file");
    }

    try {
        const bytes = await bannerFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename with safer characters
        const timestamp = Date.now();
        const cleanName = bannerFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}-${cleanName}`;
        
        // Set path to the assets directory
        const assetsDir = path.join(process.cwd(), "src/assets");
        const uploadDir = path.join(assetsDir, "banners");
        
        if (!fs.existsSync(uploadDir)) {
            try {
                fs.mkdirSync(uploadDir, { recursive: true });
            } catch (mkdirError: any) {
                throw new Error(`Failed to create banners directory: ${mkdirError.message || 'Unknown error'}`);
            }
        }
        
        const filePath = path.join(uploadDir, filename);

        // Write file
        await writeFile(filePath, buffer);


        // Return filename
        return filename;

    } catch (error: any) {
        throw new Error("Failed to upload banner image");
    }
}
