import ChannelsPageList from "@/components/shared/channels-page-list";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
export default async function MyChannelPage() {
    const session = await auth();
    const videos = await prisma.video.findMany({
        where: {
            uploadedById: session?.user?.id
        }
    });

    return (
        <ChannelsPageList videos={videos} />
    )
}
