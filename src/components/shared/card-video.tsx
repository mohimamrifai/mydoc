"use client"
import Link from "next/link"
import { renderStars } from "@/components/shared/render-stars"
import { Video } from "@prisma/client"
import formatPrice from "@/lib/format-price"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"

interface CardVideoProps {
    video: Video & {
        reviews: { rating: number }[]
        uploadedBy: { name: string | null }
    }
}

export default function CardVideo({ video }: CardVideoProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <div className="relative w-full h-48">
                        <Image
                            src={`/api/thumbnail/${video.thumbnailUrl}`}
                            alt={video.title}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>

                        <DialogTitle className="hidden">{video.title}</DialogTitle>
                    </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]">
                    <video 
                        controls
                        className="w-full"
                        src={`/api/video-previews/${video.videoPreviewUrl}`}
                        autoPlay
                    />
                </DialogContent>
            </Dialog>
            
            <Link href={`/product/${video.id}`}>
                <div className="p-4">
                    <h3 className="font-medium text-sm mb-1 line-clamp-2">{video.title}</h3>
                    <p className="text-sm text-muted-foreground">{video.uploadedBy?.name || 'Unknown'}</p>
                    <div className="flex items-center mt-2 space-x-1">
                        {renderStars(video.reviews.reduce((acc, review) => acc + review.rating, 0) / (video.reviews.length || 1))}
                        <span className="text-sm text-muted-foreground ml-1">({video.reviews.length})</span>
                    </div>
                    <div className="flex items-center mt-2 text-xs text-muted-foreground">
                        <span>{video.reviews.length} reviews</span>
                    </div>
                    <div className="mt-2">
                        <span className="text-lg font-bold text-primary">
                            Rp. {video.price && video.discount ? formatPrice(video.price * (1 - video.discount)) : video.price ? formatPrice(video.price) : 'Gratis'}
                        </span>
                        {video.discount && video.price && (
                            <span className="text-sm text-muted-foreground line-through ml-2">
                                Rp. {formatPrice(video.price)}
                            </span>
                        )}
                    </div>
                </div>
            </Link>
        </div>
    )
}
