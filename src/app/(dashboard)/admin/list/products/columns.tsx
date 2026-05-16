"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Trash } from "lucide-react";
import Image from "next/image";
import { VideoStatus } from "@prisma/client";
import formatPrice from "@/lib/format-price";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { updateStatusVideo } from "@/lib/actions/update-status-video";
import { deleteVideo } from "@/lib/actions/delete-video";

export type ProductColumns = {
    id: string
    title: string
    owner: string
    price: number
    thumbnail: string
    category: string
    status: VideoStatus
    videoUrl: string
    videoPreviewUrl: string
}

export const columns: ColumnDef<ProductColumns>[] = [
    {
        accessorKey: "thumbnail",
        header: () => (
            <div className="truncate">Thumbnail</div>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col min-w-0">
                <Image src={`/api/thumbnail/${row.original.thumbnail}`} alt={row.original.title} className="w-16 h-10 rounded-md" width={1000} height={1000} />
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
                <span className={`text-xs w-max md:text-sm px-2 py-1 rounded-full ${row.original.status === VideoStatus.APPROVED ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                    {row.original.status}
                </span>
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
        accessorKey: "price",
        header: () => (
            <div className="truncate">Price</div>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col min-w-0">
                <p className="text-xs md:text-sm truncate">
                    Rp. {formatPrice(row.original.price)}
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
        accessorKey: "owner",
        header: () => (
            <div className="truncate">Owner</div>
        ),
        cell: ({ row }) => (
            <div className="flex flex-col min-w-0">
                <p className="text-xs md:text-sm truncate">
                    {row.original.owner}
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
                    <ButtonDelete id={row.original.id} title={row.original.title} />
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    }
]

function ButtonView({ data }: { data: ProductColumns }) {
    const [open, setOpen] = useState(false);
    const [status, setStatus] = useState<VideoStatus>(data.status);
    const [message, setMessage] = useState("");

    const handleSubmit = async () => {
        try {
            if(status === VideoStatus.REJECTED) {
                if(message === "") {
                    toast.error("Rejection message is required");
                    return;
                } else {
                    await updateStatusVideo(data.id, status, message);
                    toast.success("Video status updated");
                }
            } else {
                await updateStatusVideo(data.id, status, message);
                toast.success("Video status updated");
            }
        } catch (error) {
            toast.error("Failed to update video status");
        }
        setOpen(false);
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
                <DialogContent className="w-[95vw] max-w-[1200px] h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Product Details</DialogTitle>
                        <DialogDescription>
                            Detailed information about the product
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-medium mb-2">Title</h4>
                                    <p className="text-sm text-muted-foreground">{data.title}</p>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2">Owner</h4>
                                    <p className="text-sm text-muted-foreground">{data.owner}</p>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2">Category</h4>
                                    <p className="text-sm text-muted-foreground">{data.category}</p>
                                </div>
                                <div>
                                    <h4 className="font-medium mb-2">Price</h4>
                                    <p className="text-sm text-muted-foreground">Rp. {formatPrice(data.price)}</p>
                                </div>
                            </div>
                            
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                handleSubmit();
                            }} className="space-y-6">
                                <div>
                                    <h4 className="font-medium mb-2">Status</h4>
                                    <Select value={status} onValueChange={(value) => setStatus(value as VideoStatus)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={VideoStatus.PENDING}>Pending</SelectItem>
                                            <SelectItem value={VideoStatus.APPROVED}>Approved</SelectItem>
                                            <SelectItem value={VideoStatus.REJECTED}>Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                {status === VideoStatus.REJECTED && (
                                    <div>
                                        <h4 className="font-medium mb-2">Rejection Message</h4>
                                        <Textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Enter reason for rejection..."
                                            className="min-h-[100px]"
                                        />
                                    </div>
                                )}
                                <Button type="submit" className="w-full">Update Status</Button>
                            </form>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h4 className="font-medium mb-2">Thumbnail</h4>
                                <div className="relative aspect-video w-full">
                                    <Image 
                                        src={`/api/thumbnail/${data.thumbnail}`} 
                                        alt={data.title} 
                                        className="rounded-md object-cover"
                                        fill
                                    />
                                </div>
                            </div>
                            <div>
                                <h4 className="font-medium mb-2">Video Preview</h4>
                                <video 
                                    src={`/api/video-previews/${data.videoPreviewUrl}`} 
                                    controls
                                    className="w-full aspect-video rounded-md"
                                />
                            </div>
                            <div>
                                <h4 className="font-medium mb-2">Full Video</h4>
                                <video 
                                    src={`/api/main-video/${data.videoUrl}`} 
                                    controls
                                    className="w-full aspect-video rounded-md"
                                />
                            </div>
                        </div>
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
                        <DialogTitle>Delete Product</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete {title}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex justify-end gap-4">
                        <Button variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={async () => {
                            await deleteVideo(id, title);
                            setOpen(false)
                        }}>
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
