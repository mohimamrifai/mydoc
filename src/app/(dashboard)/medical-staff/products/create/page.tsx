import FormCreateProductMedicalStaff from "@/components/forms/form-create-product-medical-staff";
import { prisma } from "@/lib/prisma";

export default async function CreateProductPage() {
    const categories = await prisma.category.findMany();
    const subCategories = await prisma.subCategory.findMany();
    return (
        <FormCreateProductMedicalStaff categories={categories} subCategories={subCategories} />
    );
}
