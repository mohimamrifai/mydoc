import { Video } from "@prisma/client";
import { Play } from "lucide-react";

export default function CardVideoPlayer({ video, isOrdered }: { video: Video, isOrdered: boolean }) {

    return (
        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
            {video ? (
                <>
                    <video 
                        src={isOrdered ? `/api/video-main/${video.id}` : `/api/video-previews/${video.videoPreviewUrl}`}
                        className="w-full h-full object-cover"
                        controls
                        poster={`/api/thumbnail/${video.thumbnailUrl}`}
                    />
                </>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <Play size={48} className="text-muted-foreground mb-2" />
                    <p className="text-muted-foreground text-center">Video tidak ditemukan</p>
                </div>
            )}
        </div>
    )
}
