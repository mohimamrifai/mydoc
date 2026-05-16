"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Trash } from "lucide-react";
import formatPrice from "@/lib/format-price";
import dayjs from "@/lib/dayjs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Image from "next/image";

export type OrderColumns = {
    id: string
    orderNumber: string
    customerName: string
    totalAmount: number
    status: string
    orderDate: string
}

export const columns: ColumnDef<OrderColumns>[] = [
    {
        accessorKey: "orderNumber",
        header: () => (
            <div className="truncate">Order Number</div>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col min-w-0">
                <p className="text-xs md:text-sm font-medium truncate">
                    #{row.original.orderNumber}
                </p>
            </div>
        ),
    },
    {
        accessorKey: "customerName", 
        header: () => (
            <div className="truncate">Customer Name</div>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col min-w-0">
                <p className="text-xs md:text-sm truncate">
                    {row.original.customerName}
                </p>
            </div>
        ),
    },
    {
        accessorKey: "totalAmount",
        header: () => (
            <div className="truncate">Total Amount</div>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col min-w-0">
                <p className="text-xs md:text-sm truncate">
                    Rp. {formatPrice(row.original.totalAmount)}
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
                <span className={`text-xs md:text-sm px-2 py-1 rounded-full w-fit
                    ${row.original.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                    row.original.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                    row.original.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 
                    'bg-gray-100 text-gray-800'}`}>
                    {row.original.status}
                </span>
            </div>
        ),
    },
    {
        accessorKey: "orderDate",
        header: () => (
            <div className="truncate">Order Date</div>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col min-w-0">
                <p className="text-xs md:text-sm truncate">
                    {dayjs(row.original.orderDate).format('dddd, DD MMMM YYYY HH:mm')}
                </p>
            </div>
        ),
    },
    {
        enablePinning: true,
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => {
            const dummyData = {
                id: row.original.id,
                orderNumber: row.original.orderNumber,
                customerName: row.original.customerName,
                totalAmount: row.original.totalAmount,
                status: row.original.status,
                orderDate: row.original.orderDate,
                videoTitle: "Sample Video Title",
                videoPrice: 100000,
                videoThumbnail: "/placeholder.png"
            };

            const handleUpdateStatus = () => {
                console.log("Update status");
            }

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <div className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="w-full flex flex-row items-center justify-start gap-2">
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                    <DialogTitle>Order Details</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h3 className="font-semibold mb-2">Order Information</h3>
                                            <p>Order Number: #{dummyData.orderNumber}</p>
                                            <p>Order Date: {dayjs(dummyData.orderDate).format('DD MMMM YYYY HH:mm')}</p>
                                            <p>Total Amount: Rp. {formatPrice(dummyData.totalAmount)}</p>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-2">Customer Information</h3>
                                            <p>Name: {dummyData.customerName}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-2">Product Information</h3>
                                        <div className="flex gap-4 items-start">
                                            <Image src={`/api/thumbnail/${dummyData.videoThumbnail}`} alt={dummyData.videoTitle} className="w-32 h-20 object-cover rounded" />
                                            <div>
                                                <p className="font-medium">{dummyData.videoTitle}</p>
                                                <p>Rp. {formatPrice(dummyData.videoPrice)}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="status">Order Status</Label>
                                            <Select defaultValue={dummyData.status}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="PENDING">PENDING</SelectItem>
                                                    <SelectItem value="COMPLETED">COMPLETED</SelectItem>
                                                    <SelectItem value="CANCELLED">CANCELLED</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button onClick={() => handleUpdateStatus} className="mt-2">Update Status</Button>
                                        </div>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                        <Button variant="destructive" size="sm" className="w-full flex flex-row items-center justify-start gap-2">
                            <Trash className="mr-2 h-4 w-4" />
                            Cancel Order
                        </Button>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    }
]
