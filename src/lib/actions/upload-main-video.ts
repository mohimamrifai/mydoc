"use server";

import { writeFile } from "fs/promises";
import path from "path";
import fs from "fs";

export async function uploadMainVideo(videoFile: File) {
    if (!videoFile || videoFile.size === 0) {
        throw new Error("Invalid or empty video file");
    }

    try {
        const bytes = await videoFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create unique filename with safer characters
        const timestamp = Date.now();
        const cleanName = videoFile.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}-${cleanName}`;
        
        // Set path to the assets directory
        const assetsDir = path.join(process.cwd(), "src/assets");
        const uploadDir = path.join(assetsDir, "main-video");
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            try {
                fs.mkdirSync(uploadDir, { recursive: true });
            } catch (mkdirError: any) {
                throw new Error(`Failed to create directory: ${mkdirError.message || 'Unknown error'}`);
            }
        }
        
        const filePath = path.join(uploadDir, filename);

        // Write file
        await writeFile(filePath, buffer);

        // Return URL path that can be used in src attribute
        return filename

    } catch (error: any) {
        throw new Error("Failed to upload main video");
    }
}
