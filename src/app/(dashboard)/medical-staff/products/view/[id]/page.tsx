import ViewProductPageClient from "@/components/shared/view-product-page";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";

export default async function ViewProductPage({ params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        
        // Handle case where ID is undefined or invalid
        if (!resolvedParams.id || resolvedParams.id === 'undefined') {
            return notFound();
        }
        
        const product = await prisma.video.findUnique({
            where: {
                id: resolvedParams.id
            },
            include: {
                category: true,
                SubCategory: true,
                reviews: true,
                orders: true,
            }
        });
    
        if (!product) {
            return notFound();
        }
    
        const allSubCategories = await prisma.subCategory.findMany({
            where: {
                id: {
                    in: product?.subCategorieIds || []
                }
            }
        });
    
        // Calculate average rating if there are reviews
        const averageRating = product.reviews.length > 0 
            ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length 
            : 0;
    
        return (
            <ViewProductPageClient product={product} allSubCategories={allSubCategories} averageRating={averageRating} />
        );
    } catch (error) {
        return (
            <div className="text-center p-8">
                <h2 className="text-red-500 text-xl mb-4">Error Loading Product</h2>
                <p className="text-gray-600 mb-4">There was a problem loading this product. The ID may be invalid or the product may not exist.</p>
            </div>
        );
    }
}
