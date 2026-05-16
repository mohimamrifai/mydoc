"use client"
import dayjs from "dayjs";
import Image from "next/image";
import { DollarSign, Tag, Layers, Star, ShoppingCart, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CardVideoWithDuration from "@/components/shared/card-video-with-duration";
import formatPrice from "@/lib/format-price";

export default function ViewProductPageClient({ 
    product, 
    allSubCategories, 
    averageRating }: 
    { product: any, allSubCategories: any, averageRating: any }) {
    return (
        <div className="mx-auto my-2 max-w-full px-2 sm:px-4">
            <div className="border-b p-2">
                <div className="flex flex-col md:flex-row justify-between gap-3 md:items-center">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold">{product.title}</h1>
                        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                            Uploaded on {dayjs(product.createdAt).format('DD MMMM YYYY')}
                        </p>
                    </div>
                    <Badge
                        variant={product.status === "APPROVED" ? "default" :
                            product.status === "PENDING" ? "secondary" : "destructive"}
                        className="text-xs sm:text-sm px-2 sm:px-3 py-0.5 sm:py-1 self-start md:self-auto"
                    >
                        {product.status}
                    </Badge>
                </div>
            </div>
            <div className="p-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 mb-4 sm:mb-8">
                    <div>
                        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4">
                            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 flex items-center">
                                <span className="bg-primary/10 p-1.5 sm:p-2 rounded-full mr-2">
                                    <Tag className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                </span>
                                Main Video
                            </h2>
                            <div className="relative rounded-lg overflow-hidden">
                                {product.videoUrl ? (
                                    <CardVideoWithDuration type="main-video" videoUrl={product.videoUrl} thumbnailUrl={product.thumbnailUrl ?? ""} />
                                ) : (
                                    <div className="aspect-video bg-gray-200 flex items-center justify-center">
                                        <Image
                                            src={product.thumbnailUrl ? `/api/thumbnail/${product.thumbnailUrl}` : "/placeholder-video.jpg"}
                                            alt="Video thumbnail"
                                            width={640}
                                            height={360}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <p className="text-xs sm:text-sm md:text-base text-white font-medium">Video not available</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4">
                            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 flex items-center">
                                <span className="bg-primary/10 p-1.5 sm:p-2 rounded-full mr-2">
                                    <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                </span>
                                Video Preview
                            </h2>
                            <div className="relative rounded-lg overflow-hidden">
                                {product.videoPreviewUrl ? (
                                    <CardVideoWithDuration type="video-previews" videoUrl={product.videoPreviewUrl} thumbnailUrl={product.thumbnailUrl ?? ""} />
                                ) : (
                                    <div className="aspect-video bg-gray-200 flex items-center justify-center">
                                        <Image
                                            src={product.thumbnailUrl ? `/api/thumbnail/${product.thumbnailUrl}` : "/placeholder-video.jpg"}
                                            alt="Video preview thumbnail"
                                            width={640}
                                            height={360}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                            <p className="text-xs sm:text-sm md:text-base text-white font-medium">Preview not available</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-8">
                    <div className="md:col-span-1">
                        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg h-full">
                            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 flex items-center">
                                <span className="bg-primary/10 p-1.5 sm:p-2 rounded-full mr-2">
                                    <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                </span>
                                Product Info
                            </h2>
                            <div className="space-y-2 sm:space-y-3">
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="text-xs sm:text-sm text-muted-foreground">Price:</span>
                                    <span className="font-semibold text-sm sm:text-lg">{formatPrice(product.price || 0)}</span>
                                </div>
                                {product.discount && product.discount > 0 && (
                                    <div className="flex justify-between items-center border-b pb-2">
                                        <span className="text-xs sm:text-sm text-muted-foreground">Discount:</span>
                                        <Badge variant="outline" className="bg-green-50 text-xs">{product.discount * 100}% OFF</Badge>
                                    </div>
                                )}
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="text-xs sm:text-sm text-muted-foreground">Orders:</span>
                                    <span className="font-medium text-xs sm:text-sm flex items-center">
                                        <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                                        {product.orders.length}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs sm:text-sm text-muted-foreground">Rating:</span>
                                    <span className="font-medium text-xs sm:text-sm flex items-center">
                                        <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-yellow-500" />
                                        {averageRating.toFixed(1)} ({product.reviews.length})
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="md:col-span-2">
                        <div className="bg-gray-50 p-3 sm:p-4 rounded-lg h-full">
                            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 flex items-center">
                                <span className="bg-primary/10 p-1.5 sm:p-2 rounded-full mr-2">
                                    <Layers className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                                </span>
                                Description
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-line">{product.description}</p>

                            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t">
                                <h3 className="text-sm sm:text-base font-medium mb-2">Categories</h3>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="secondary" className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm">
                                        {product.category.name}
                                    </Badge>
                                </div>
                            </div>

                            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t">
                                <h3 className="text-sm sm:text-base font-medium mb-2">Sub Categories</h3>
                                <div className="flex flex-wrap gap-2">
                                    {allSubCategories.length > 0 ? (
                                        allSubCategories.map((subCategory: any) => (
                                            <Badge key={subCategory.id} variant="outline" className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm">
                                                {subCategory.name}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-xs sm:text-sm text-gray-500">No sub categories</span>
                                    )}
                                </div>
                            </div>

                            {product.message && (
                                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t">
                                    <h3 className="text-sm sm:text-base font-medium mb-2">Additional Message</h3>
                                    <p className="text-xs sm:text-sm text-gray-700 italic">{product.message}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Thumbnail</h2>
                    <div className="flex justify-center">
                        {product.thumbnailUrl ? (
                            <Image
                                src={`/api/thumbnail/${product.thumbnailUrl}`}
                                width={640}
                                height={360}
                                alt="Thumbnail"
                                className="rounded-md object-cover shadow-md w-full max-w-lg"
                            />
                        ) : (
                            <div className="bg-gray-200 rounded-md w-full max-w-lg aspect-video flex items-center justify-center">
                                <p className="text-xs sm:text-sm text-gray-500">No thumbnail available</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
