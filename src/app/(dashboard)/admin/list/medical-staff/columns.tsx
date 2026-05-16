"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Trash, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { FormEditMedicalStaff } from "@/components/forms/form-edit-medical-staff";
import { deleteAccount } from "@/lib/actions/delete-account";
import { StatusMedical } from "@prisma/client";

export type MedicalStaffColumns = {
  id: string
  name: string
  email: string
  jumlahProdukDisetujui: number
  jumlahProdukDitolak: number
  jumlahProdukMenunggu: number
  statusAkun: StatusMedical
}

export const columns: ColumnDef<MedicalStaffColumns>[] = [
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
    accessorKey: "statusAkun",
    header: () => (
      <div className="truncate">Status Akun</div>
    ),
    cell: ({ row }) => {
      const status = row.original.statusAkun;
      let statusText = "";
      let statusColor = "";

      switch (status) {
        case "ACTIVE":
          statusText = "Aktif";
          statusColor = "text-green-600";
          break;
        case "PENDING":
          statusText = "Menunggu";
          statusColor = "text-yellow-600";
          break;
        case "INACTIVE":
          statusText = "Tidak Aktif";
          statusColor = "text-red-600";
          break;
      }

      return (
        <div className="flex flex-col min-w-0">
          <p className={`text-xs md:text-sm truncate ${statusColor}`}>
            {statusText}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "jumlahProdukDisetujui",
    header: () => (
      <div className="truncate">Produk Disetujui</div>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col min-w-0">
        <p className="text-xs md:text-sm truncate">
          {row.original.jumlahProdukDisetujui}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "jumlahProdukDitolak",
    header: () => (
      <div className="truncate">Produk Ditolak</div>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col min-w-0">
        <p className="text-xs md:text-sm truncate">
          {row.original.jumlahProdukDitolak}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "jumlahProdukMenunggu",
    header: () => (
      <div className="truncate">Produk Menunggu</div>
    ),
    cell: ({ row }) => (
      <div className="flex flex-col min-w-0">
        <p className="text-xs md:text-sm truncate">
          {row.original.jumlahProdukMenunggu}
        </p>
      </div>
    ),
  },
  {
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
          <FormEditMedicalStaff statusAkun={row.original.statusAkun} name={row.original.name} email={row.original.email} id={row.original.id} />
          <ButtonDelete id={row.original.id} name={row.original.name} />
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  }
]

function ButtonView({ data }: { data: MedicalStaffColumns }) {
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
            <DialogTitle>Medical Staff Details</DialogTitle>
            <DialogDescription>
              Detailed information about the medical staff member
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
            <div>
              <h4 className="font-medium">Status</h4>
              <p className={`text-sm ${
                data.statusAkun === "ACTIVE" ? "text-green-600" :
                data.statusAkun === "PENDING" ? "text-yellow-600" :
                "text-red-600"
              }`}>
                {data.statusAkun === "ACTIVE" ? "Aktif" :
                 data.statusAkun === "PENDING" ? "Menunggu" :
                 "Tidak Aktif"}
              </p>
            </div>
            <div>
              <h4 className="font-medium">Product Statistics</h4>
              <div className="grid grid-cols-3 gap-4 mt-2">
                <div>
                  <p className="text-sm font-medium">Approved</p>
                  <p className="text-sm text-muted-foreground">{data.jumlahProdukDisetujui}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Rejected</p>
                  <p className="text-sm text-muted-foreground">{data.jumlahProdukDitolak}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Pending</p>
                  <p className="text-sm text-muted-foreground">{data.jumlahProdukMenunggu}</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}


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
            <DialogTitle>Delete Medical Staff</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <form action={async () => {
              await deleteAccount(id, "MEDICAL_STAFF")
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
