"use client";
import { SubCategory, Category, User, Review, Video } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import dayjs from "@/lib/dayjs";
import formatPrice from "@/lib/format-price";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
interface VideoWithRelations extends Video {
    uploadedBy: User;
    category: Category;
    subCategory: SubCategory;
    reviews: {
        user: User;
        rating: number;
        comment: string;
    }[];
}

export default function ChannelDetailPage({ video }: { video: VideoWithRelations }) {
    const router = useRouter();

    return (
        <div className="container mx-auto px-4 py-6">
            <Button variant="outline" className="mb-4" onClick={() => router.back()}>
                Back
            </Button>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Video Player Section */}
                <div className="lg:col-span-2">
                    <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
                        <video
                            src={`/api/main-video/${video.videoUrl}`}
                            controls
                            className="w-full h-full"
                            poster={`/api/thumbnail/${video.thumbnailUrl}`}
                        />
                    </div>

                    {/* Video Info */}
                    <div className="mt-4">
                        <h1 className="text-2xl font-bold">{video.title}</h1>

                        <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={video.uploadedBy?.image || ""} />
                                    <AvatarFallback>{video.uploadedBy?.name?.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-semibold">{video.uploadedBy?.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {dayjs(video.createdAt).fromNow()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="font-semibold mb-2">Description</h3>
                            <p className="text-muted-foreground whitespace-pre-wrap">
                                {video.description}
                            </p>
                        </div>

                        {/* Reviews Section */}
                        <div className="mt-8">
                            <h3 className="text-xl font-semibold mb-4">Rating & Reviews</h3>
                            <div className="space-y-6">
                                {video.reviews.map((review) => (
                                    <div key={review.user.id} className="border-b pb-4">
                                        <div className="flex items-center gap-4 mb-2">
                                            <Avatar>
                                                <AvatarImage src={review.user.image || ""} />
                                                <AvatarFallback>{review.user.name?.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold">{review.user.name}</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex">
                                                        {[...Array(review.rating)].map((_, i) => (
                                                            <span key={i} className="text-yellow-400">★</span>
                                                        ))}
                                                        {[...Array(5 - review.rating)].map((_, i) => (
                                                            <span key={i} className="text-gray-300">★</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {review.comment && (
                                            <p className="text-muted-foreground ml-12">{review.comment}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {video.reviews.length === 0 && (
                                <p className="text-muted-foreground">No reviews yet</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-1">
                    <h2 className="font-semibold mb-4">Product Details</h2>
                    <div className="space-y-4">
                        <div className="p-4 rounded-lg border">
                            <p className="font-medium">Price</p>
                            <p className="text-xl font-bold">
                                {video.discount ? (
                                    <>
                                        <span className="line-through text-muted-foreground text-base mr-2">
                                            Rp. {formatPrice(video.price!)}
                                        </span>
                                        Rp. {formatPrice(video.price! * (1 - video.discount/100))}
                                        <span className="ml-2 text-sm text-green-600">
                                            ({video.discount}% OFF)
                                        </span>
                                    </>
                                ) : (
                                    <>Rp. {formatPrice(video.price!)}</>
                                )}
                            </p>
                        </div>
                        <div className="p-4 rounded-lg border">
                            <p className="font-medium">Category</p>
                            <p className="text-muted-foreground">{video.category.name}</p>
                            {video.subCategory && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    Sub Category: {video.subCategory.name}
                                </p>
                            )}
                        </div>
                        <div className="p-4 rounded-lg border">
                            <p className="font-medium">Status</p>
                            <p className="capitalize text-muted-foreground">{video.status}</p>
                            {video.message && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    Message: {video.message}
                                </p>
                            )}
                        </div>
                        <div className="p-4 rounded-lg border">
                            <p className="font-medium">Reviews</p>
                            <p className="text-muted-foreground">
                                {video.reviews.length} reviews
                            </p>
                            {video.reviews.length > 0 && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    Average Rating: {
                                        (video.reviews.reduce((acc, review) => acc + review.rating, 0) / video.reviews.length).toFixed(1)
                                    } / 5
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
