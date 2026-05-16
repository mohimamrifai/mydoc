"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { Category, SubCategory, Video } from "@prisma/client";
// import { updateProductMedicalStaff } from "@/lib/actions/update-product";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { ResponseServerActionType } from "@/lib/respon-server-action";
import { updateProductMedicalStaff } from "@/lib/actions/update-product-medical-staff";

interface FormUpdateProductMedicalStaffProps {
    allCategories: Category[];
    allSubCategories: SubCategory[];
    product: Video;
}

export const formUpdateProductMedicalStaffSchema = z.object({
    title: z.string().min(3, {
        message: "Title must be at least 3 characters.",
    }),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
    categoryId: z.string({
        message: "Category is required.",
    }),
    subCategorieIds: z.array(z.string()).default([]),
    thumbnailUrl: z.string({
        message: "Thumbnail is required.",
    }),
    videoUrl: z.string({
        message: "Video is required.",
    }),
    price: z.preprocess((val) => Number(val), z.number().min(1, {
        message: "Price is required.",
    })),
    videoPreviewUrl: z.string({
        message: "Video preview is required.",
    }),
});

export default function FormUpdateProductMedicalStaff({ allCategories, allSubCategories, product }: FormUpdateProductMedicalStaffProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
    const [videoPreviewFile, setVideoPreviewFile] = useState<File | null>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const thumbnailInputRef = useRef<HTMLInputElement>(null);
    const videoPreviewInputRef = useRef<HTMLInputElement>(null);
    const [optionSubCategories, setOptionSubCategories] = useState<SubCategory[]>([]);
    const session = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    const form = useForm<z.infer<typeof formUpdateProductMedicalStaffSchema>>({
        resolver: zodResolver(formUpdateProductMedicalStaffSchema),
        defaultValues: {
            title: product.title,
            description: product.description,
            categoryId: product.categoryId,
            subCategorieIds: product.subCategorieIds || [],
            thumbnailUrl: product.thumbnailUrl!,
            videoUrl: product.videoUrl!,
            price: product.price!,
            videoPreviewUrl: product.videoPreviewUrl!,
        }
    });

    useEffect(() => {
        const categoryId = form.watch("categoryId");
        if (categoryId) {
            const filteredSubCategories = allSubCategories.filter(
                (subCategory) => subCategory.categoryId === categoryId
            );
            setOptionSubCategories(filteredSubCategories);
            if (categoryId !== product.categoryId) {
                form.setValue("subCategorieIds", []); // Reset subcategories when category changes
            } else {
                form.setValue("subCategorieIds", product.subCategorieIds || []); // Set default subcategories
            }
        }
    }, [form.watch("categoryId"), allSubCategories, form, product.categoryId, product.subCategorieIds]);

    const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setVideoFile(e.target.files[0]);
            form.setValue("videoUrl", URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setThumbnailFile(e.target.files[0]);
            form.setValue("thumbnailUrl", URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleVideoPreviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setVideoPreviewFile(e.target.files[0]);
            form.setValue("videoPreviewUrl", URL.createObjectURL(e.target.files[0]));
        }
    };

    const onSubmit = async (values: z.infer<typeof formUpdateProductMedicalStaffSchema>) => {
        try {
            setIsSubmitting(true);
            setShowDialog(true);
            const formData = new FormData();

            if (videoFile) {
                formData.append("video", videoFile);
            }
            if (videoPreviewFile) {
                formData.append("videoPreview", videoPreviewFile);
            }
            if (thumbnailFile) {
                formData.append("thumbnail", thumbnailFile);
            }

            const result: ResponseServerActionType = await updateProductMedicalStaff(product.id, values, formData);
            if (result.status === "success") {
                toast.success(result.message);
                form.reset();
                router.push(`/medical-staff/products`);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setIsSubmitting(false);
            setShowDialog(false);
        }
    };

    return (
        <div className="container mx-auto py-6 px-4 sm:px-6">
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-xl font-bold">Update Video Product</h1>
                    <p className="text-muted-foreground text-sm">Update the details of your video product</p>
                </div>

                <Card className="border-none shadow-none">
                    <CardHeader className="p-2">
                        <CardTitle>Product Information</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter video title" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="price"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Price</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter video price" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="categoryId"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel>Category</FormLabel>
                                                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {allCategories.map((category) => (
                                                            <div key={category.id} className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    checked={form.watch("categoryId") === category.id}
                                                                    onCheckedChange={() => {
                                                                        form.setValue("categoryId", category.id);
                                                                        form.setValue("subCategorieIds", []);
                                                                    }}
                                                                />
                                                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                                    {category.name}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </ScrollArea>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="subCategorieIds"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel>Sub Categories</FormLabel>
                                                <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                        {optionSubCategories.map((subCategory) => (
                                                            <div key={subCategory.id} className="flex items-center space-x-2">
                                                                <Checkbox
                                                                    checked={form.watch("subCategorieIds").includes(subCategory.id)}
                                                                    onCheckedChange={(checked) => {
                                                                        const currentValues = form.watch("subCategorieIds");
                                                                        if (checked) {
                                                                            form.setValue("subCategorieIds", [...currentValues, subCategory.id]);
                                                                        } else {
                                                                            form.setValue(
                                                                                "subCategorieIds",
                                                                                currentValues.filter((id) => id !== subCategory.id)
                                                                            );
                                                                        }
                                                                    }}
                                                                />
                                                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                                    {subCategory.name}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </ScrollArea>
                                                <FormDescription>
                                                    Select 1-3 sub-categories for your video product.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter video description"
                                                    className="min-h-[120px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div>
                                        <FormLabel>Main Video</FormLabel>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => videoInputRef.current?.click()}
                                                className="w-full sm:w-auto"
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                Select Video
                                            </Button>
                                            <Input
                                                ref={videoInputRef}
                                                type="file"
                                                accept="video/*"
                                                className="hidden"
                                                onChange={handleVideoChange}
                                            />
                                            {videoFile && (
                                                <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                                                    {videoFile.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <FormLabel>Video Review (Preview)</FormLabel>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => videoPreviewInputRef.current?.click()}
                                                className="w-full sm:w-auto"
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                Select Preview Video
                                            </Button>
                                            <Input
                                                ref={videoPreviewInputRef}
                                                type="file"
                                                accept="video/*"
                                                className="hidden"
                                                onChange={handleVideoPreviewChange}
                                            />
                                            {videoPreviewFile && (
                                                <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                                                    {videoPreviewFile.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <FormLabel>Thumbnail</FormLabel>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => thumbnailInputRef.current?.click()}
                                                className="w-full sm:w-auto"
                                            >
                                                <Upload className="mr-2 h-4 w-4" />
                                                Select Thumbnail
                                            </Button>
                                            <Input
                                                ref={thumbnailInputRef}
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleThumbnailChange}
                                            />
                                            {thumbnailFile && (
                                                <span className="text-sm text-muted-foreground truncate max-w-[200px]">
                                                    {thumbnailFile.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {isLoading && (
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">Uploading...</span>
                                            <span className="text-sm font-medium">{uploadProgress}%</span>
                                        </div>
                                        <Progress value={uploadProgress} className="h-2" />
                                    </div>
                                )}

                                <div className="flex justify-end">
                                    <Button type="submit" disabled={isSubmitting || isLoading} className="w-full sm:w-auto">
                                        {isSubmitting || isLoading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Updating Product...
                                            </>
                                        ) : (
                                            "Update Product"
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Submitting...</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="h-6 w-6 animate-spin" />
                        <span>Please wait while we update your product.</span>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
