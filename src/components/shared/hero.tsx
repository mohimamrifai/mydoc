"use client"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay"
import { Banner } from "@prisma/client";

export default function Hero({ banners }: { banners: Banner[] }) {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
            <Carousel plugins={[
                Autoplay({
                    delay: 5000,
                }),
            ]} className="w-full">
                <CarouselContent>
                    {banners.map((banner) => (
                        <CarouselItem key={banner.id}>
                            <div className="relative h-[250px] sm:h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 z-10" />
                                <Image
                                    src={`/api/banner/${banner.imageUrl}`}
                                    alt={banner.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                                <div className="absolute bottom-4 sm:bottom-6 md:bottom-10 left-4 sm:left-6 md:left-10 z-20 text-white max-w-[90%] sm:max-w-xl md:max-w-2xl p-2">
                                    <h2 className="text-xl sm:text-2xl md:text-4xl font-bold mb-2 sm:mb-3 md:mb-4">{banner.title}</h2>
                                    <p className="text-sm sm:text-base md:text-lg line-clamp-2 sm:line-clamp-3">{banner.description}</p>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-2 sm:left-4 hidden sm:flex" />
                <CarouselNext className="right-2 sm:right-4 hidden sm:flex" />
            </Carousel>
        </div>
    );
}
