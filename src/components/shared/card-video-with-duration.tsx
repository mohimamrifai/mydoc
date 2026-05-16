"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function CardVideoWithDuration({ videoUrl, thumbnailUrl, type }: { videoUrl: string, thumbnailUrl: string, type: "main-video" | "video-previews" }) {
    const [videoError, setVideoError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check if the video file exists before trying to load it
    useEffect(() => {
        const checkVideoExists = async () => {
            try {
                if (!videoUrl) {
                    throw new Error("No video URL provided");
                }

                setIsLoading(true);
                // Use HEAD request to check if video exists without downloading it
                const response = await fetch(`/api/${type}/${videoUrl}`, { 
                    method: 'HEAD',
                    cache: 'no-store' 
                });
                
                if (!response.ok) {
                    setVideoError(true);
                }
            } catch (error) {
                setVideoError(true);
            } finally {
                setIsLoading(false);
            }
        };

        if (videoUrl) {
            checkVideoExists();
        } else {
            setVideoError(true);
            setIsLoading(false);
        }
    }, [videoUrl, type]);

    if (isLoading) {
        return (
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                <div className="animate-pulse flex items-center justify-center w-full h-full bg-gray-200">
                    <p className="text-sm text-gray-500">Loading video...</p>
                </div>
            </div>
        );
    }

    if (videoError || !videoUrl) {
        return (
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    {thumbnailUrl && (
                        <Image
                            src={thumbnailUrl ? `/api/thumbnail/${thumbnailUrl}` : "/placeholder-video.jpg"}
                            alt="Video thumbnail"
                            width={640}
                            height={360}
                            className="w-full h-full object-cover opacity-50"
                        />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <p className="text-white text-sm">Video could not be loaded</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            <video
                src={`/api/${type}/${videoUrl}`}
                className="w-full h-full object-cover"
                controls
                poster={thumbnailUrl ? `/api/thumbnail/${thumbnailUrl}` : undefined}
                onError={() => setVideoError(true)}
            />
        </div>
    );
}   
