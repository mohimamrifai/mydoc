import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { prisma } from "@/lib/prisma";
import { FormCreateCategoryAndSubCategory } from "@/components/forms/form-create-category-and-subcategory";


const ListCategoriesPage = async () => {

    const allCategories = await prisma.category.findMany();
    const allSubCategories = await prisma.subCategory.findMany();

    const formattedCategories = allCategories.map((category) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        subCategories: allSubCategories.filter((subCategory) => subCategory.categoryId === category.id),
        subCategoriesCount: allSubCategories.filter((subCategory) => subCategory.categoryId === category.id).length
    }));

    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-4">
                <h1 className="text-xl font-bold">Category List</h1>
                <FormCreateCategoryAndSubCategory />
            </div>
            <DataTable columns={columns} data={formattedCategories} />
        </div>
    );
};

export default ListCategoriesPage;