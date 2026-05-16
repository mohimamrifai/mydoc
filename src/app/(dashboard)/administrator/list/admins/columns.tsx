"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Trash, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { FormEditAdmin } from "@/components/forms/form-edit-admin";
import { deleteAccount } from "@/lib/actions/delete-account";
export type AdminColumns = {
  id: string
  name: string
  email: string
}

export const columns: ColumnDef<AdminColumns>[] = [
  {
    accessorKey: "id",
    header: () => (
      <div className="truncate">ID</div>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col min-w-0">
        <p className="text-xs md:text-sm truncate">
          {row.original.id}
        </p>
      </div>
    ),
  },
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
    accessorKey: "email",
    header: () => (
      <div className="truncate">Email</div>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col min-w-0">
        <p className="text-xs md:text-sm truncate">
          {row.original.email}
        </p>
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
          <FormEditAdmin name={row.original.name} email={row.original.email} id={row.original.id} />
          <ButtonDelete id={row.original.id} name={row.original.name} />
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }
]

function ButtonDelete({ id, name }: { id: string, name: string }) {
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
            <DialogTitle>Delete Admin</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <form action={async () => {
              await deleteAccount(id, "ADMIN")
              setOpen(false)
            }}>
              <Button variant="destructive" type="submit">
                Delete
              </Button>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}


function ButtonView({ data }: { data: AdminColumns }) {
  const [open, setOpen] = useState(false);

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
            <DialogTitle>Admin Details</DialogTitle>
            <DialogDescription>
              Detailed information about the admin
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Name</h4>
              <p className="text-sm text-muted-foreground">{data.name}</p>
            </div>
            <div>
              <h4 className="font-medium">Email</h4>
              <p className="text-sm text-muted-foreground">{data.email}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}