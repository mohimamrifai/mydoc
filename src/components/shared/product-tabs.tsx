import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "../ui/button"
import CardVideo from "./card-video"


export default async function ProductTabs() {
    const categories = await prisma.category.findMany({
        include: {
            subCategories: true,
        },
    });
    const videos = await prisma.video.findMany({
        where: {
            status: "APPROVED"
        },
        include: {
            category: true,
            reviews: true,
            uploadedBy: true,
        },
    });

    const categoriesWithArrays: Record<string, string[]> = categories.reduce((acc, category) => {
        acc[category.name] = category.subCategories.map(sub => sub.name);
        return acc;
    }, {} as Record<string, string[]>);

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
            <Tabs defaultValue="Dokter Umum" className="w-full">
                <ScrollArea className="w-full pb-4">
                    <TabsList className="inline-flex min-w-max gap-2 h-10">
                        {Object.keys(categoriesWithArrays).map((category) => (
                            <TabsTrigger
                                className="text-center px-3 py-1.5 text-sm whitespace-normal h-auto"
                                key={category}
                                value={category}
                            >
                                {category}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>

                {Object.entries(categoriesWithArrays).map(([category, subcategories]) => (
                    <TabsContent key={category} value={category} className="mt-1">
                        <ScrollArea className="w-full whitespace-nowrap">
                            <div className="flex space-x-3 pb-4">
                                {subcategories.map((subcategory) => (
                                    <Link
                                        key={subcategory}
                                        href={`/search?category=${encodeURIComponent(category)}&sub-category=${encodeURIComponent(subcategory)}`}
                                        className="min-w-[120px] sm:min-w-[150px] lg:min-w-[180px] p-2 sm:p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                                    >
                                        <h3 className="font-medium text-center text-sm">{subcategory}</h3>
                                        <p className="text-sm text-gray-500 text-center">Lebih dari 200 Video</p>
                                    </Link>
                                ))}
                                <Link
                                    href={`/search?category=${encodeURIComponent(category)}`}
                                    className="min-w-[120px] sm:min-w-[150px] lg:min-w-[180px] p-2 sm:p-4 rounded-lg border bg-primary/5 text-primary hover:bg-primary/10 transition-colors cursor-pointer flex flex-col items-center justify-center"
                                >
                                    <h3 className="font-medium text-center text-sm">Lihat Semua</h3>
                                    <p className="text-sm text-center">Kategori {category}</p>
                                </Link>
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                            {videos
                                .filter(video => video.category.name === category)
                                .slice(0, 8)
                                .map((video) => (
                                    <CardVideo key={video.id} video={video} />
                                ))}
                        </div>
                        <div className="mt-8 text-center">
                            <Button
                                asChild
                                variant="outline"
                                className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-primary/90 transition-colors"
                            >
                                <Link href={`/search`}>
                                    Cari Kelas Lainnya
                                </Link>
                            </Button>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}
