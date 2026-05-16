"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Trash, Edit } from "lucide-react";
import Image from "next/image";
import dayjs from "@/lib/dayjs";
import formatPrice from "@/lib/format-price";
import { SubCategory } from "@prisma/client";
import { deleteProduct } from "@/lib/actions/delete-product";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import Link from "next/link";

export type ColumnProduct = {
    id: string
    title: string
    description: string
    status: "" | "rejected" | "pending" | "approved"
    price: number
    thumbnailUrl: string
    uploadedBy: string
    category: string
    subCategories: SubCategory[]
    date: Date
    message: string
}

export const columns: ColumnDef<ColumnProduct>[] = [
    {
        accessorKey: "thumbnail",
        header: () => (
            <div className="truncate w-[100px]">Thumbnail</div>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col w-[100px]">
                <Image src={`/api/thumbnail/${row.original.thumbnailUrl}`} alt={row.original.title} className="w-36 h-16 md:h-16 md:w-44 rounded-md" width={1000} height={1000} />
            </div>
        ),
    },
    {
        accessorKey: "title",
        header: () => (
            <div className="truncate">Title</div>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col min-w-0">
                <p className="text-xs md:text-sm font-medium truncate">
                    {row.original.title}
                </p>
            </div>
        ),
    },
    {
        accessorKey: "status",
        header: () => (
            <div className="truncate">Status</div>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col min-w-0">
                <span className={`text-xs px-2 py-0.5 w-max rounded-full ${row.original.status === "approved" ? 'bg-green-100 text-green-800' :
                    row.original.status === "pending" ? 'bg-yellow-100 text-yellow-800' :
                        row.original.status === "rejected" ? 'bg-red-100 text-red-800' :
                            ''
                    }`}>
                    {row.original.status}
                </span>
                {row.original.status === "rejected" && (
                    <MessageDialog message={row.original.message} />
                )}
            </div>
        ),
    },
    {
        accessorKey: "price",
        header: () => (
            <div className="truncate">Price</div>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col min-w-0">
                <p className="text-xs md:text-sm truncate">
                    {formatPrice(row.original.price)}
                </p>
            </div>
        ),
    },
    {
        accessorKey: "category",
        header: () => (
            <div className="truncate">Category</div>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col min-w-0">
                <p className="text-xs md:text-sm truncate">
                    {row.original.category}
                </p>
            </div>
        ),
    },
    {
        accessorKey: "subCategories",
        header: () => (
            <div className="truncate">Sub Categories</div>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col min-w-0">
                {row.original.subCategories.length > 0 ? (
                    <SubCategoriesButton subCategories={row.original.subCategories} />
                ) : (
                    <span>-</span>
                )}
            </div>
        ),
    },
    {
        accessorKey: "date",
        header: () => (
            <div className="truncate">Tanggal Upload</div>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col min-w-0">
                <p className="text-xs md:text-sm font-medium truncate">
                    {dayjs(row.original.date).format('DD MMMM YYYY HH:mm')}
                </p>
            </div>
        ),
    },
    {
        id: "actions",
        enableHiding: false,
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
                    <Button asChild variant="ghost" size="sm" className="w-full flex flex-row items-center justify-start gap-2">
                        <Link href={`/medical-staff/products/view/${row.original.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View
                        </Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm" className="w-full flex flex-row items-center justify-start gap-2">
                        <Link href={`/medical-staff/products/edit/${row.original.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </Link>
                    </Button>
                    <ButtonDelete id={row.original.id} />               
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    }
]

const SubCategoriesButton = ({ subCategories }: { subCategories: SubCategory[] }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
                View Sub Categories
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Sub Categories</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 gap-4">
                        {subCategories.map((subCategory) => (
                            <div key={subCategory.id} className="p-2 border rounded-md">
                                <p className="text-sm font-medium">{subCategory.name}</p>
                            </div>
                        ))}
                        <DialogFooter className="mt-4">
                            <Button onClick={() => setOpen(false)}>Close</Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

const MessageDialog = ({ message }: { message: string }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button variant="ghost" size="sm" onClick={() => setOpen(true)}>
                View Message
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rejection Message</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 gap-4">
                        <div className="p-2 border rounded-md">
                            <p className="text-sm font-medium">{message}</p>
                        </div>
                        <DialogFooter className="mt-4">
                            <Button onClick={() => setOpen(false)}>Close</Button>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
};

const ButtonDelete = ({ id }: { id: string }) => {
    const [open, setOpen] = useState(false);

    const handleDelete = async () => {
        const result = await deleteProduct(id);
        if (result.status === "success") {
            toast.success(result.message);
        } else {
            toast.error(result.message);
        }
        setOpen(false);
    }

    return (
        <>
            <Button onClick={() => setOpen(true)} variant="destructive" size="sm" className="w-full flex flex-row items-center justify-start gap-2">
                <Trash className="mr-2 h-4 w-4" />
                Delete
            </Button>
            <AlertDialog open={open} onOpenChange={setOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="space-y-4">
                        <p>Are you sure you want to delete this product?</p>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}