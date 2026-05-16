"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

interface CategoryInput {
  categoryName: string;
  subCategories: string[];
}

export const createCategory = async (data: CategoryInput) => {
  try {
    const { categoryName, subCategories } = data;

    // Validate category name
    if (!categoryName || categoryName.trim().length === 0) {
      return { status: "error", message: "Category name is required" };
    }

    // Check if category already exists
    const existingCategory = await prisma.category.findFirst({
      where: { name: categoryName }
    });
    if (existingCategory) {
      return { status: "error", message: "Category already exists" };
    }

    // Validate subcategories
    if (!Array.isArray(subCategories) || subCategories.length === 0) {
      return { status: "error", message: "At least one subcategory is required" };
    }

    // Check for empty subcategory names
    if (subCategories.some(sub => !sub || sub.trim().length === 0)) {
      return { status: "error", message: "Subcategory names cannot be empty" };
    }

    // Check if any subcategories already exist
    const existingSubCategories = await prisma.subCategory.findMany({
      where: {
        name: {
          in: subCategories
        }
      }
    });

    if (existingSubCategories.length > 0) {
      const duplicateNames = existingSubCategories.map(sub => sub.name).join(", ");
      return { status: "error", message: `The following subcategories already exist: ${duplicateNames}` };
    }

    // Create slug from category name
    const slug = categoryName.toLowerCase().replace(/\s+/g, '-');

    // Create category
    const category = await prisma.category.create({
      data: {
        name: categoryName,
        slug: slug,
      },
    });

    // Create subcategories
    for (const subCategory of subCategories) {
      const subCategorySlug = subCategory.toLowerCase().replace(/\s+/g, '-');
      await prisma.subCategory.create({
        data: {
          name: subCategory,
          slug: subCategorySlug,
          categoryId: category.id,
        },
      });
    }

    revalidatePath("/admin/list/categories");
    return { status: "success", message: "Category and subcategories created successfully" };

  } catch (error) {
    return { status: "error", message: "Failed to create category" };
  }
};
