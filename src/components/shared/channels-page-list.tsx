import { Video } from "@prisma/client";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import dayjs from "@/lib/dayjs"
import Link from "next/link";

export default function ChannelsPageList({videos}: {videos: Video[]}) {
    return (
        <div className="px-4 py-2">
            <h1 className="text-xl font-bold mb-3">My Channel</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {videos.map((video: Video) => (
                    <Link key={video.id} href={`/medical-staff/channels/${video.id}`} className="overflow-hidden shadow-md rounded-lg">
                        <div className="p-0">
                            <div className="relative aspect-video border-b">
                                <Image
                                    src={`/api/thumbnail/${video.thumbnailUrl}`}
                                    alt={video.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold line-clamp-2">{video.title}</h3>
                                <div className="mt-2 text-xs text-muted-foreground">
                                    <span>{dayjs(video.createdAt).fromNow()}</span>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
