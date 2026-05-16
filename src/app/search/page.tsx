import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";
import { Suspense } from "react";
import SearchContent from "@/components/shared/search-content";
import { prisma } from "@/lib/prisma";
import { Video, VideoStatus } from "@prisma/client";

export default async function SearchPage({
    searchParams
}: {
    searchParams: Promise<{ query?: string, category?: string, "sub-category"?: string }>
}) {
    const { query = "", category, "sub-category": subCategory } = await searchParams;

    const decodedCategory = category ? decodeURIComponent(category) : "";
    const decodedSubCategory = subCategory ? decodeURIComponent(subCategory) : "";

    const videos = await prisma.video.findMany({
        where: {
            AND: [
                {
                    status: VideoStatus.APPROVED,
                },
                query ? {
                    OR: [
                        { title: { contains: query, mode: 'insensitive' } },
                        { description: { contains: query, mode: 'insensitive' } }
                    ]
                } : {},
                category ? {
                    categoryId: {
                        in: (await prisma.category.findFirst({
                            where: { name: decodedCategory }
                        }))?.id ? [(await prisma.category.findFirst({
                            where: { name: decodedCategory }
                        }))!.id] : []
                    }
                } : {},
                subCategory ? {
                    subCategorieIds: {
                        has: (await prisma.subCategory.findFirst({
                            where: { name: decodedSubCategory }
                        }))?.id
                    }
                } : {}
            ]
        },
        include: {
            reviews: {
                select: {
                    rating: true
                }
            },
            uploadedBy: {
                select: {
                    name: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    return (
        <div className="mt-16">
            <Navbar />
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <h1 className="text-xl font-bold">
                        {query
                            ? `Hasil pencarian untuk "${query}"`
                            : category && subCategory
                                ? `Hasil pencarian untuk kategori "${decodedCategory}" dan sub kategori "${decodedSubCategory}"`
                                : category
                                    ? `Hasil pencarian untuk kategori "${decodedCategory}"`
                                    : 'Video Terbaru'
                        }
                    </h1>
                    <p className="text-muted-foreground">
                        {videos.length} video ditemukan
                    </p>
                </div>
                <Suspense fallback={<div className="w-full max-w-7xl mx-auto px-4 py-12 text-center">Loading...</div>}>
                    <SearchContent data={videos} />
                </Suspense>
            </div>
            <Footer />
        </div>
    );
}
