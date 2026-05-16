"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Trash } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { updateBannerStatus } from "@/lib/actions/update-banner-status";
import FormEditBanner from "@/components/forms/form-edit-banner";
import { deleteBanner } from "@/lib/actions/delete-banner";

export type BannerColumns = {
  id: string
  image: string
  title: string
  description: string
  status: string
}

export const columns: ColumnDef<BannerColumns>[] = [
  {
    accessorKey: "image",
    header: () => (
      <div className="truncate">Image</div>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col min-w-0">
        <Image
          src={`/api/banner/${row.original.image}`} 
          alt={row.original.title}
          width={100}
          height={100}
          className="h-12 w-12 object-cover rounded"
        />
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
    accessorKey: "description",
    header: () => (
      <div className="truncate">Description</div>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col min-w-0">
        <p className="text-xs md:text-sm truncate">
          {row.original.description}
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
        <span className={`text-xs md:text-sm px-2 w-max py-1 rounded-full ${
          row.original.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {row.original.status}
        </span>
      </div>
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
          <ButtonView data={row.original} />
          <FormEditBanner data={row.original} />
          <ButtonDelete id={row.original.id} title={row.original.title} />
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }
]

function ButtonView({ data }: { data: BannerColumns }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(data.status);

  const handleSubmit = async () => {
    try {
      // Add your update status logic here
      const result = await updateBannerStatus(data.id, status);
      if (result.status === "success") {
        toast.success(result.message);
        setOpen(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update banner status");
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="w-full flex flex-row items-center justify-start gap-2"
        onClick={() => setOpen(true)}
      >
        <Eye className="mr-2 h-4 w-4" />
        View
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Banner Details</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-2">Image</h4>
              <div className="relative aspect-video w-full">
                <Image 
                  src={`/api/banner/${data.image}`} 
                  alt={data.title} 
                  className="rounded-md object-cover"
                  fill
                />
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Title</h4>
              <p className="text-sm text-muted-foreground">{data.title}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-sm text-muted-foreground">{data.description}</p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }} className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Status</h4>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">Update Status</Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function ButtonDelete({ id, title }: { id: string, title: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="destructive"
        size="sm"
        className="w-full flex flex-row items-center justify-start gap-2"
        onClick={() => setOpen(true)}
      >
        <Trash className="mr-2 h-4 w-4" />
        Delete
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Banner</DialogTitle>
          </DialogHeader>
          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={async () => {
              try {
                // Add your delete logic here
                await deleteBanner(id);
                toast.success("Banner deleted successfully");
                setOpen(false);
              } catch (error) {
                toast.error("Failed to delete banner");
              }
            }}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
