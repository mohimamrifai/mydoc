"use client";

import Image from "next/image";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export interface VideoPurchase {
    id: string;
    title: string;
    description: string;
    videoUrl: string | null;
    thumbnailUrl: string | null;
    price: number | null;
    uploadedBy: {
        name: string | null;
    };
    createdAt: string;
}

export default function PurchasesPageComponent({ videos }: { videos: VideoPurchase[] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredVideos, setFilteredVideos] = useState<VideoPurchase[]>(videos);
    const [selectedVideo, setSelectedVideo] = useState<VideoPurchase | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const filtered = videos.filter(video => 
            video.title.toLowerCase().includes(query.toLowerCase()) ||
            video.description.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredVideos(filtered);
    };

    const handleWatchVideo = (video: VideoPurchase) => {
        setSelectedVideo(video);
        setIsDialogOpen(true);
    };

    return (
        <div className="container mx-auto p-3">
            <div className="mb-4">
                <h1 className="text-xl font-bold">Riwayat Pembelian</h1>
                <p className="text-sm text-muted-foreground">Daftar video yang telah Anda beli</p>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Cari video..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full md:w-72 px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredVideos.map((video, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-all duration-200"
                    >
                        <div className="aspect-video bg-gray-100 relative">
                            {video.thumbnailUrl ? (
                                <Image 
                                    src={`/api/thumbnail/${video.thumbnailUrl}`} 
                                    alt={video.title}
                                    className="object-cover w-full h-full"
                                    width={100}
                                    height={100}
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                                    <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <button 
                                    className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center hover:bg-white/95 transition-colors group"
                                    onClick={() => handleWatchVideo(video)}
                                >
                                    <svg
                                        className="w-6 h-6 text-primary group-hover:scale-110 transition-transform"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="p-4">
                            <h3 className="font-medium text-lg line-clamp-2 mb-2">{video.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{video.description}</p>

                            <div className="flex items-center gap-2 mb-3">
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-sm font-medium">
                                        {video.uploadedBy.name ? video.uploadedBy.name.charAt(0) : '?'}
                                    </span>
                                </div>
                                <div className="text-sm text-gray-600">{video.uploadedBy.name || 'Instruktur'}</div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                <div>{new Date(video.createdAt).toLocaleDateString('id-ID')}</div>
                                <div>Rp {video.price?.toLocaleString('id-ID') || '0'}</div>
                            </div>

                            <button 
                                onClick={() => handleWatchVideo(video)}
                                className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors"
                            >
                                Tonton Video
                            </button>
                        </div>
                    </div>
                ))}
                {filteredVideos.length === 0 && (
                    <div className="col-span-full text-center text-sm text-muted-foreground">
                        Anda belum membeli video apapun
                    </div>
                )}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[60vw] max-h-[80vh] overflow-hidden">
                    {selectedVideo?.videoUrl && (
                        <div className="aspect-video">
                            <video 
                                src={`/api/main-video/${selectedVideo.videoUrl}`}
                                controls
                                className="w-full"
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )}
                    <DialogTitle>{selectedVideo?.title}</DialogTitle>
                </DialogContent>
            </Dialog>
        </div>
    );
}
