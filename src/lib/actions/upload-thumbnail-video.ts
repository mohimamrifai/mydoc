"use server";

import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

export async function uploadThumbnailVideo(thumbnailFile: File) {
    if (!thumbnailFile || thumbnailFile.size === 0) {
        throw new Error("Invalid or empty thumbnail file");
    }

    try {
        const bytes = await thumbnailFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename with safer characters
        const timestamp = Date.now();
        const cleanName = thumbnailFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}-${cleanName}`;
        
        // Set path to the assets directory
        const assetsDir = path.join(process.cwd(), "src/assets");
        const uploadDir = path.join(assetsDir, "thumbnails");
        
        if (!fs.existsSync(uploadDir)) {
            try {
                fs.mkdirSync(uploadDir, { recursive: true });
            } catch (mkdirError: any) {
                throw new Error(`Failed to create thumbnail directory: ${mkdirError.message || 'Unknown error'}`);
            }
        }
        
        const filePath = path.join(uploadDir, filename);

        // Write file
        await writeFile(filePath, buffer);


        // Return URL path that can be used in src attribute
        return filename

    } catch (error: any) {
        throw new Error("Failed to upload thumbnail video");
    }
}
