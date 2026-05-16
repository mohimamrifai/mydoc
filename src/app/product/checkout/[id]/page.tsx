import CheckoutComponent from "@/components/shared/checkout-component";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export default async function CheckoutPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await auth()
    const video = await prisma.video.findUnique({
        where: {
            id: id,
        },
    })

    if (!video) {
        return <div>Product not found</div>
    }

    return (
        <div className="mt-16">
            <Navbar />
            <CheckoutComponent video={video} />
            <Footer />
        </div>
    )
}
