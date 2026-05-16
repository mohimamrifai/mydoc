"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { updateProfile } from "@/lib/actions/update-profile";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    currentPassword: z.string().optional(),
    newPassword: z.string().optional(),
    imageUrl: z.string().optional(),
    username: z.string().optional(),
    phone: z.string().optional(),
    address: z.string().optional(),
    specialization: z.string().optional(),
    credentials: z.string().optional(),
    experience: z.string().optional(),
    institutionName: z.string().optional()
}).refine((data) => {
    if (data.currentPassword || data.newPassword) {
        return data.currentPassword && data.newPassword;
    }
    return true;
}, {
    message: "Both current and new password are required to change password",
    path: ["newPassword"]
}).refine((data) => {
    if (data.newPassword) {
        return data.newPassword.length >= 8;
    }
    return true;
}, {
    message: "New password must be at least 8 characters",
    path: ["newPassword"]
});

interface AdminProfilePageProps {
    user: {
        id: string;
        name: string;
        email: string;
        image?: string | null;
        medicalInfo?: {
            username: string;
            phone: string;
            address: string;
            specialization: string;
            credentials: string;
            experience: string;
            institutionName: string;
            status: string;
        } | null
    }
}

export default function AdminProfileComponent({ user }: AdminProfilePageProps) {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            currentPassword: "",
            newPassword: "",
            imageUrl: user.image ?? "",
            username: user.medicalInfo?.username ?? "",
            phone: user.medicalInfo?.phone ?? "",
            address: user.medicalInfo?.address ?? "",
            specialization: user.medicalInfo?.specialization ?? "",
            credentials: user.medicalInfo?.credentials ?? "",
            experience: user.medicalInfo?.experience ?? "",
            institutionName: user.medicalInfo?.institutionName ?? ""
        }
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            form.setValue("imageUrl", URL.createObjectURL(e.target.files[0]));
        }
    };

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("email", data.email);
            if (data.currentPassword && data.newPassword) {
                formData.append("currentPassword", data.currentPassword);
                formData.append("newPassword", data.newPassword);
            }
            if (imageFile) {
                formData.append("image", imageFile);
            }
            if (user.medicalInfo) {
                formData.append("username", data.username ?? "");
                formData.append("phone", data.phone ?? "");
                formData.append("address", data.address ?? "");
                formData.append("specialization", data.specialization ?? "");
                formData.append("credentials", data.credentials ?? "");
                formData.append("experience", data.experience ?? "");
                formData.append("institutionName", data.institutionName ?? "");
            }
            const result = await updateProfile(formData);
            if (result.status === "success") {
                toast.success("Profile updated successfully");
                form.reset()
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="p-2 sm:p-4 md:p-6">
            <Card className="w-full max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-xl sm:text-2xl">Profile Settings</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-6 sm:space-y-8">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                                <div className="flex flex-col sm:flex-row items-center gap-4">
                                    <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                                        <AvatarImage src={`/api/profile/${user.image}`} alt={user.name} />
                                        <AvatarFallback>{user.name?.charAt(0) || "U"}</AvatarFallback>
                                    </Avatar>
                                    <FormField
                                        control={form.control}
                                        name="imageUrl"
                                        render={({ field }) => (
                                            <FormItem className="w-full">
                                                <FormControl>
                                                    <Input 
                                                        type="file" 
                                                        accept="image/*" 
                                                        onChange={handleImageChange}
                                                        className="w-full"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter your name" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input type="email" placeholder="Enter your email" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {user.medicalInfo && (
                                        <>
                                            <FormField
                                                control={form.control}
                                                name="username"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Username</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter username" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="phone"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Phone</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter phone number" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="specialization"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Specialization</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter specialization" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="institutionName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Institution Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Enter institution name" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="credentials"
                                                render={({ field }) => (
                                                    <FormItem className="col-span-1 sm:col-span-2">
                                                        <FormLabel>Credentials</FormLabel>
                                                        <FormControl>
                                                            <Textarea placeholder="Enter your credentials" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="experience"
                                                render={({ field }) => (
                                                    <FormItem className="col-span-1 sm:col-span-2">
                                                        <FormLabel>Experience</FormLabel>
                                                        <FormControl>
                                                            <Textarea placeholder="Enter your experience" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="address"
                                                render={({ field }) => (
                                                    <FormItem className="col-span-1 sm:col-span-2">
                                                        <FormLabel>Address</FormLabel>
                                                        <FormControl>
                                                            <Textarea placeholder="Enter your address" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </>
                                    )}

                                    <FormField
                                        control={form.control}
                                        name="currentPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Current Password (Optional)</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type={showCurrentPassword ? "text" : "password"}
                                                            placeholder="Enter current password"
                                                            {...field}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="absolute right-2 top-1/2 -translate-y-1/2"
                                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                        >
                                                            {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="newPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>New Password (Optional)</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type={showNewPassword ? "text" : "password"}
                                                            placeholder="Enter new password"
                                                            {...field}
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="absolute right-2 top-1/2 -translate-y-1/2"
                                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                                        >
                                                            {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                        </Button>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Button type="submit" className="w-full sm:w-auto" disabled={form.formState.isSubmitting}>
                                    {form.formState.isSubmitting ? "Updating..." : "Update Profile"}
                                </Button>
                            </form>
                        </Form>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
