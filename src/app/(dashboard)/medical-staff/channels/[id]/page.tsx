import dayjs from "@/lib/dayjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ChannelDetailPage from "@/components/shared/channel-detail-page";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export default async function ChannelPage({ params }: { params: Promise<{ id: string }> }) {
    const video = await prisma.video.findUnique({
        where: {
            id: (await params).id
        },
        include: {
            uploadedBy: true,
            category: true,
            reviews: {
                include: {
                    user: true
                }
            }
        }
    });

    const allSubCategories = await prisma.subCategory.findMany();

    if (!video) {
        return <div>Video not found</div>;
    }

    const formattedVideo = {
        ...video,
        uploadedBy: video.uploadedBy,
        category: video.category,
        subCategory: allSubCategories.find((subCategory) => video.subCategorieIds.includes(subCategory.id)),
        reviews: video.reviews.map((review) => ({
            user: review.user,
            rating: review.rating,
            comment: review.comment || ""
        }))
    } as any;

    return (
        <ChannelDetailPage video={formattedVideo} />
    );
}
