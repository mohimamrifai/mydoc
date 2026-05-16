"use client";

import CardVideoPlayer from "@/components/shared/card-video-player";
import { renderStars } from "@/components/shared/render-stars";
import { Button } from "@/components/ui/button";
import { Clock, Folder } from "lucide-react";
import formatPrice from "@/lib/format-price";
import { useRouter } from "next/navigation";
import dayjs from "@/lib/dayjs";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface Review {
    id: string;
    rating: number;
    comment: string | null;
    userId: string;
    videoId: string;
    user: {
        name: string | null;
    },
    createdAt: Date;
}

interface Video {
    id: string;
    title: string;
    description: string;
    message: string | null;
    price: number | null;
    discount: number | null;
    videoUrl: string | null;
    videoPreviewUrl: string | null;
    thumbnailUrl: string | null;
    uploadedById: string;
    uploadedBy: {
        name: string | null;
        image: string | null
    };
    approvedById: string | null;
    categoryId: string;
    subCategorieIds: string[];
    reviews: Review[];
    createdAt: Date;
}

interface ProductPageComponentProps {
    video: Video;
    isOrdered: boolean;
}

export default function ProductPageComponent({ video, isOrdered }: ProductPageComponentProps) {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                <div className="lg:col-span-2">
                    <CardVideoPlayer video={video as any} isOrdered={isOrdered ? true : false} />

                    <div className="mt-4 md:mt-6">
                        <h1 className="text-xl md:text-2xl font-bold">{video.title}</h1>
                        <div className="flex flex-col md:flex-row md:items-center mt-2">
                            <div className="flex items-center gap-2">
                                <Link href={`/profile/${video.uploadedById}`}>
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={`/api/profile/${video.uploadedBy.image}`} alt={video.uploadedBy.name || ""} />
                                        <AvatarFallback>{video.uploadedBy.name?.charAt(0) || "U"}</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <Link href={`/profile/${video.uploadedById}`}>
                                    <p className="text-sm md:text-base text-muted-foreground hover:text-primary transition-colors">{video.uploadedBy.name}</p>
                                </Link>
                            </div>
                            <span className="mx-2 hidden md:block">•</span>
                            <div className="flex items-center space-x-1 mt-1 md:mt-0">
                                {renderStars(video.reviews.reduce((acc, review) => acc + review.rating, 0) / (video.reviews.length || 1))}
                                <span className="text-xs md:text-sm text-muted-foreground ml-1">({video.reviews.length > 0 ? (video.reviews.reduce((acc, review) => acc + review.rating, 0) / video.reviews.length).toFixed(1) : '0.0'})</span>
                            </div>
                        </div>
                    </div>

                    {/* Mobile price section */}
                    <div className="mt-4 lg:hidden rounded-lg border bg-card p-4">
                        <div className="bg-primary/10 p-3 rounded-lg border border-primary/20">
                            <div className="flex items-center justify-between mb-1">
                                {video.discount ? (
                                    <>
                                        <span className="text-xs font-medium text-primary bg-primary/20 px-2 py-0.5 rounded-full">Penawaran Spesial</span>
                                        <span className="text-xs font-medium text-red-500">Hemat {Math.round(video.discount * 100)}%</span>
                                    </>
                                ) : (
                                    <span className="text-xs font-medium text-primary bg-primary/20 px-2 py-0.5 rounded-full">Materi Berkualitas</span>
                                )}
                            </div>
                            <div className="flex items-baseline">
                                <span className="text-2xl font-bold text-primary">
                                    Rp. {video.price && video.discount ? formatPrice(video.price * (1 - video.discount)) : video.price ? formatPrice(video.price) : 'Gratis'}
                                </span>
                                {video.discount && video.price && (
                                    <span className="ml-2 text-sm text-muted-foreground line-through">
                                        Rp. {formatPrice(video.price)}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">Investasi sekali untuk pembelajaran seumur hidup</p>
                        </div>
                        <Button asChild className="w-full mt-3">
                            <Link href={`/product/checkout/${video.id}`}>
                                Beli Sekarang
                            </Link>
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1">{isOrdered ? 'Anda sudah membeli video ini' : null}</p>
                        <div className="mt-3 space-y-2">
                            <div className="flex items-center">
                                <Folder className="w-4 h-4 mr-2" />
                                <span className="text-sm">Akses seumur hidup</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 md:mt-8">
                        <h2 className="text-lg md:text-xl font-semibold mb-2 md:mb-4">Deskripsi</h2>
                        <p className="text-sm md:text-base text-muted-foreground">{video.description}</p>
                    </div>
                </div>

                {/* Desktop price section */}
                <div className="hidden lg:block lg:col-span-1">
                    <div className="sticky top-20">
                        <div className="rounded-lg border bg-card p-6">
                            <div className="mb-6 bg-primary/10 p-4 rounded-lg border border-primary/20">
                                <div className="flex items-center justify-between mb-2">
                                    {video.discount ? (
                                        <>
                                            <span className="text-sm font-medium text-primary bg-primary/20 px-2 py-1 rounded-full">Penawaran Spesial</span>
                                            <span className="text-sm font-medium text-red-500">Hemat {Math.round(video.discount * 100)}%</span>
                                        </>
                                    ) : (
                                        <span className="text-sm font-medium text-primary bg-primary/20 px-2 py-1 rounded-full">Materi Berkualitas</span>
                                    )}
                                </div>
                                <div className="flex items-baseline">
                                    <span className="text-3xl font-bold text-primary">
                                        Rp. {video.price && video.discount ? formatPrice(video.price * (1 - video.discount)) : video.price ? formatPrice(video.price) : 'Gratis'}
                                    </span>
                                    {video.discount && video.price && (
                                        <span className="ml-2 text-lg text-muted-foreground line-through">
                                            Rp. {formatPrice(video.price)}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground mt-2">Investasi sekali untuk pembelajaran seumur hidup</p>
                            </div>
                            <Button asChild className="w-full mt-3">
                                <Link href={`/product/checkout/${video.id}`}>
                                    Beli Sekarang
                                </Link>
                            </Button>
                            <div className="mt-6 space-y-4">
                                <div className="flex items-center">
                                    <Clock className="w-5 h-5 mr-2" />
                                    <span>Akses seumur hidup</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-3 mt-4">
                    <h2 className="text-base font-semibold mb-2">Ulasan ({video.reviews.length})</h2>
                    <div className="grid md:grid-cols-2 gap-2">
                        {video.reviews.map((review) => (
                            <div key={review.id} className="border rounded p-2">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center">
                                        <h3 className="text-sm font-medium">{review.user.name}</h3>
                                        <span className="mx-1">•</span>
                                        <div className="flex items-center">
                                            {renderStars(review.rating)}
                                        </div>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {dayjs(review.createdAt).format('DD MMMM YYYY')}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
