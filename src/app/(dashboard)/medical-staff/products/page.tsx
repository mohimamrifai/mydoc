import { Button } from "@/components/ui/button";
import { ColumnProduct, columns } from "./columns";
import { DataTable } from "./data-table";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { ColumnDef } from "@tanstack/react-table";

const ListProductsPage = async () => {

    const session = await auth();
    const products = await prisma.video.findMany({
        where: {
            uploadedById: session?.user?.id
        },
        include: {
            uploadedBy: true,
            approvedBy: true,
            category: true,
        }
    });

    const allSubCategories = await prisma.subCategory.findMany({});

    const formattedProducts = products.map((product) => ({
        id: product.id,
        title: product.title,
        description: product.description,
        status: product.status.toLowerCase(),
        price: product.price,
        thumbnailUrl: product.thumbnailUrl || "",
        uploadedBy: product.uploadedBy?.name || "",
        category: product.category.name,
        subCategories: allSubCategories.filter(sub => product.subCategorieIds.includes(sub.id)),
        date: product.createdAt,
        message: product.message
    }));

    return (
        <div className="p-2">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-4">
                <h1 className="text-xl font-bold">Product List</h1>
                <Button asChild>
                    <Link href="/medical-staff/products/create">Add Product</Link>
                </Button>
            </div>
            <div className="w-[270px] md:w-full">
                <DataTable 
                    columns={columns as any} 
                    data={formattedProducts} 
                />
            </div>
        </div>
    );
};

export default ListProductsPage;