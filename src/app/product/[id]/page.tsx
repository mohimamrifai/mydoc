import Navbar from "@/components/shared/navbar"
import Footer from "@/components/shared/footer"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import ProductPageComponent from "@/components/shared/product-page-component"

export default async function ProductPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const session = await auth()
    const { id } = await params
    const video = await prisma.video.findUnique({
        where: {
            id: id
        },
        include: {
            uploadedBy: true,
            category: true,
            reviews: {
                include: {
                    user: true
                }
            },
        }
    })
    const isOrdered = await prisma.order.findFirst({
        where: {
            userId: session?.user?.id,
            videoId: video?.id
        }
    })

    if (!video) {
        return (
            <div className="mt-16">
                <Navbar />
                <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <h1 className="text-2xl font-bold text-center">Hasil pencarian tidak ditemukan</h1>
                    <p className="text-muted-foreground text-center">Coba cari kembali dengan kata kunci yang lain</p>
                    <Link href="/search" className="text-primary w-max mx-auto block mt-4 py-2 px-4 rounded-md bg-primary text-white hover:bg-primary/80 transition-colors">Kembali ke halaman utama</Link>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="mt-16">
            <Navbar />
            <ProductPageComponent video={video} isOrdered={isOrdered ? true : false} />
            <Footer />
        </div>
    )
}
