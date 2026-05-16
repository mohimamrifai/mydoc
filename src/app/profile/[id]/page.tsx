import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";
import { renderStars } from "@/components/shared/render-stars";
import formatPrice from "@/lib/format-price";
import Navbar from "@/components/shared/navbar";
import Footer from "@/components/shared/footer";

interface Props {
    params: Promise<{ id: string }>
}

export default async function PublicProfilePage({ params }: Props) {
    const { id } = await params;
    const user = await prisma.user.findUnique({
        where: { id },
        include: {
            medicalStaffInfo: true,
            videos: {
                where: { status: "APPROVED" },
                include: {
                    reviews: true,
                    category: true,
                }
            }
        }
    });

    if (!user?.medicalStaffInfo?.status || user.medicalStaffInfo.status !== "ACTIVE") {
        redirect('/404');
    }

    return (
        <>
            <Navbar />
            <main className="min-h-screen bg-gray-50 py-4 sm:py-6 md:py-8 mt-16">
                <div className="container mx-auto px-3 sm:px-4 ">
                    {/* Profile Info */}
                    <div className="mb-6 bg-white rounded-lg p-4 shadow-md">
                        <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
                            <Avatar className="h-16 w-16 sm:h-20 sm:w-20 ring-2 ring-primary/20">
                                <AvatarImage src={`/api/profile/${user.image}`} alt={user.name || ""} className="object-cover" />
                                <AvatarFallback className="text-2xl">{user.name?.[0] || "U"}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1 text-center sm:text-left w-full">
                                <h1 className="text-lg sm:text-xl font-bold text-gray-900">{user.name}</h1>
                                <p className="text-sm text-primary">@{user.medicalStaffInfo.username}</p>
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-primary/10 text-primary rounded-full mt-1">
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <span className="text-xs">{user.medicalStaffInfo.specialization}</span>
                                </div>
                                
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                    <div className="space-y-2 bg-gray-50 p-2.5 rounded">
                                        <h3 className="font-medium text-gray-900">Professional Info</h3>
                                        <ProfileInfo label="Institution" value={user.medicalStaffInfo.institutionName} />
                                        <ProfileInfo label="Experience" value={user.medicalStaffInfo.experience} />
                                        <ProfileInfo label="Credentials" value={user.medicalStaffInfo.credentials} />
                                    </div>
                                    <div className="space-y-2 bg-gray-50 p-2.5 rounded">
                                        <h3 className="font-medium text-gray-900">Contact Info</h3>
                                        <ProfileInfo label="Contact" value={user.medicalStaffInfo.phone} />
                                        <ProfileInfo label="Email" value={user.email} />
                                        <ProfileInfo label="Address" value={user.medicalStaffInfo.address} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Videos Section */}
                    <div>
                        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6">Educational Videos</h2>
                        {user.videos.length > 0 ? (
                            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                                {user.videos.map((video) => (
                                    <Link href={`/product/${video.id}`} key={video.id}>
                                        <Card className="h-full hover:shadow-md transition-all bg-white">
                                            <div className="relative aspect-video">
                                                <Image
                                                    src={`/api/thumbnail/${video.thumbnailUrl}`}
                                                    alt={video.title}
                                                    fill
                                                    className="object-cover rounded-t-lg"
                                                />
                                                <div className="absolute inset-0 bg-black/20 hover:bg-black/30 transition-colors flex items-center justify-center">
                                                    <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M8 5v14l11-7z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <CardContent className="p-2 sm:p-3">
                                                <h3 className="font-medium text-sm sm:text-base mb-1 line-clamp-2">{video.title}</h3>
                                                <p className="text-xs text-muted-foreground mb-1">{video.category.name}</p>
                                                <div className="flex items-center gap-1 mb-1.5">
                                                    {renderStars(video.reviews.reduce((acc, review) => acc + review.rating, 0) / video.reviews.length || 0)}
                                                    <span className="text-xs text-muted-foreground">({video.reviews.length})</span>
                                                </div>
                                                <p className="text-xs text-muted-foreground line-clamp-2 mb-1.5">{video.description}</p>
                                                <div className="text-sm sm:text-base font-semibold text-primary">
                                                    {video.price ? (
                                                        <PriceDisplay price={video.price} discount={video.discount} />
                                                    ) : (
                                                        <span>Free</span>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <Card className="p-4 sm:p-6 text-center text-muted-foreground bg-white">
                                No videos available yet.
                            </Card>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}

function ProfileInfo({ label, value }: { label: string; value: string }) {
    return (
        <div className="border-t pt-2 sm:pt-3">
            <h4 className="font-medium text-primary mb-0.5 sm:mb-1">{label}</h4>
            <p className="text-sm sm:text-base text-muted-foreground">{value}</p>
        </div>
    );
}

function PriceDisplay({ price, discount }: { price: number; discount?: number | null }) {
    if (discount) {
        return (
            <div className="flex items-center gap-1 sm:gap-2">
                <span>Rp. {formatPrice(price * (1 - discount))}</span>
                <span className="text-xs sm:text-sm text-muted-foreground line-through">Rp. {formatPrice(price)}</span>
            </div>
        );
    }
    return <span>Rp. {formatPrice(price)}</span>;
}
