import FormUpdateProductMedicalStaff from "@/components/forms/form-update-product-medical-staff";
import { prisma } from "@/lib/prisma";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
    const AllCategories = await prisma.category.findMany();
    const AllSubCategories = await prisma.subCategory.findMany();
    const product = await prisma.video.findUnique({
        where: {
            id: (await params).id
        }
    });

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <FormUpdateProductMedicalStaff allCategories={AllCategories} allSubCategories={AllSubCategories} product={product} />
    );
}
