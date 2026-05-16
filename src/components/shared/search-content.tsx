import { Video } from "@prisma/client"
import Link from "next/link"
import CardVideo from "./card-video"

interface SearchContentProps {
    data: (Video & {
        reviews: { rating: number }[]
        uploadedBy: { name: string | null }
    })[]
}

export default async function SearchContent({ data }: SearchContentProps) {
    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {data.map((video) => (
                    <CardVideo key={video.id} video={video} />
                ))}
            </div>

            {data.length === 0 && (
                <div className="text-center py-12">
                    <h2 className="text-xl font-semibold mb-2">Tidak ada video ditemukan</h2>
                    <p className="text-muted-foreground">
                        Coba cari dengan kata kunci lain atau lihat semua video kami
                    </p>
                    <Link
                        href="/"
                        className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                        Kembali ke Beranda
                    </Link>
                </div>
            )}
        </div>
    )
}