"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Trash, Edit } from "lucide-react";
import { SubCategory } from "@prisma/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormEditCategoryAndSubCategory } from "@/components/forms/form-edit-category-and-subcategory";

export type CategoryColumns = {
  id: string
  name: string
  slug: string
  subCategories: SubCategory[]
  subCategoriesCount: number
}

export const columns: ColumnDef<CategoryColumns>[] = [
  {
    accessorKey: "name",
    header: () => (
      <div className="truncate">Name</div>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col min-w-0">
        <p className="text-xs md:text-sm font-medium truncate">
          {row.original.name}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "slug",
    header: () => (
      <div className="truncate">Slug</div>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col min-w-0">
        <p className="text-xs md:text-sm truncate">
          {row.original.slug}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "subcategoriesCount",
    header: () => (
      <div className="truncate">Banyak Sub Kategori</div>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col min-w-0">
        <p className="text-xs md:text-sm truncate">
          {row.original.subCategoriesCount}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "subCategories",
    header: () => (
      <div className="truncate">Lihat Sub Kategori</div>
    ),
    cell: ({ row }) => (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Lihat Sub Kategori
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sub Kategori untuk {row.original.name}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            {row.original.subCategories.length > 0 ? (
              row.original.subCategories.map((subCategory) => (
                <div key={subCategory.id} className="p-2 border rounded">
                  <p className="text-sm font-medium">{subCategory.name}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Tidak ada sub kategori</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    ),
  },
  {
    enablePinning: true,
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <FormEditCategoryAndSubCategory categoryId={row.original.id} categoryName={row.original.name} subCategories={row.original.subCategories} />
          <Button variant="destructive" size="sm" className="w-full flex flex-row items-center justify-start gap-2">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }
]
