import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { prisma } from "@/lib/prisma";
import { VideoStatus } from "@prisma/client";

const ListProductsPage = async () => {
    const videos = await prisma.video.findMany({
        select: {
            id: true,
            title: true,
            price: true,
            thumbnailUrl: true,
            status: true,
            videoUrl: true,
            videoPreviewUrl: true,
            category: {
                select: {
                    name: true
                }
            },
            uploadedBy: {
                select: {
                    name: true
                }
            }
        }
    });

    const formattedVideos = videos.map(video => {
        return {
            id: video.id,
            title: video.title,
            owner: video.uploadedBy.name || 'Unknown',
            price: video.price || 0,
            thumbnail: video.thumbnailUrl || '/placeholder.png',
            category: video.category.name,
            status: video.status,
            videoUrl: video.videoUrl || '',
            videoPreviewUrl: video.videoPreviewUrl || ''
        };
    });

    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-4">
                <h1 className="text-xl font-bold">Product List</h1>
            </div>
            <DataTable columns={columns} data={formattedVideos} />
        </div>
    );
};

export default ListProductsPage;