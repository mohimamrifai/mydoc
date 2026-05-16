import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    
    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    // Pastikan filename tidak mengandung path traversal
    if (filename.includes('..')) {
      return NextResponse.json({ error: 'Invalid filename' }, { status: 400 });
    }

    // Path ke file dalam `src/assets/videos/`
    const filePath = path.join(process.cwd(), 'src', 'assets', 'video-previews', filename);
    
    // Cek apakah file ada
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Video file not found' }, { status: 404 });
    }

    try {
      // Baca file sebagai buffer
      const fileBuffer = fs.readFileSync(filePath);

      // Tentukan MIME type berdasarkan ekstensi file
      const ext = path.extname(filename).toLowerCase();
      const mimeTypes: { [key: string]: string } = {
        '.mp4': 'video/mp4',
        '.webm': 'video/webm',
        '.mov': 'video/quicktime',
        '.avi': 'video/x-msvideo',
        '.mkv': 'video/x-matroska'
      };
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      
      // Return the file without JSON wrapping
      return new NextResponse(fileBuffer, {
        headers: { 
          'Content-Type': contentType,
          'Accept-Ranges': 'bytes',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    } catch (fileError) {
      return NextResponse.json({ error: 'Error reading video file' }, { status: 500 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
