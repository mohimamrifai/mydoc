import PurchasesPageComponent, { VideoPurchase } from "@/components/shared/purchases-page-component";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function PurchasesPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    // Get all purchased videos for the user
    const orders = await prisma.order.findMany({
        where: {
            userId: session.user.id,
            status: "COMPLETED"
        },
        include: {
            video: {
                include: {
                    uploadedBy: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    });

    // Format data according to VideoPurchase interface
    const formattedData: VideoPurchase[] = orders.map(order => ({
        id: order.video.id,
        title: order.video.title,
        description: order.video.description,
        videoUrl: order.video.videoUrl,
        thumbnailUrl: order.video.thumbnailUrl,
        price: order.video.price,
        uploadedBy: {
            name: order.video.uploadedBy.name
        },
        createdAt: order.video.createdAt.toISOString()
    }));

    return (
        <PurchasesPageComponent videos={formattedData} />
    );
}
