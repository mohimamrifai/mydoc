"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { register } from "@/lib/actions/register";
import { ResponseServerActionType } from '@/lib/respon-server-action';
import { updateInfoMedical } from '@/lib/actions/update-info-medical';
import { loginWithCredential } from '@/lib/actions/login-with-credential';

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Nama harus minimal 2 karakter"
    }),
    email: z.string().email({
        message: "Email tidak valid"
    }),
    password: z.string().min(8, {
        message: "Password minimal 8 karakter"
    }),
    confirmPassword: z.string(),
    username: z.string().min(3, {
        message: "Username minimal 3 karakter"
    }),
    phone: z.string().min(10, {
        message: "No telepon tidak valid"
    }),
    address: z.string().min(10, {
        message: "Alamat minimal 10 karakter"
    }),
    specialization: z.string().min(2, {
        message: "Spesialisasi minimal 2 karakter"
    }),
    credentials: z.string().min(2, {
        message: "Pendidikan terakhir minimal 2 karakter"
    }),
    experience: z.string().min(2, {
        message: "Pengalaman terakhir minimal 2 karakter"
    }),
    institutionName: z.string().min(2, {
        message: "Nama rumah sakit/perusahaan minimal 2 karakter"
    })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
});

export default function RegisterMedicalStaff() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const randomNumber = Math.floor(Math.random() * 1000);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "Dr. John Doe",
            email: `johndoe${randomNumber}@example.com`,
            password: "password123",
            confirmPassword: "password123",
            username: `drjohn${randomNumber}`,
            phone: "081234567890",
            address: "Jl. Kesehatan No. 123, Jakarta Selatan ",
            specialization: "Dokter Umum",
            credentials: "S1 Kedokteran Universitas Indonesia",
            experience: "5 tahun sebagai dokter umum",
            institutionName: "Rumah Sakit Sehat Sejahtera"
        },
    });

    const isSubmitting = form.formState.isSubmitting;

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
            const result: ResponseServerActionType = await register({
                name: data.name,
                email: data.email,
                password: data.password,
                role: "MEDICAL_STAFF"
            });

            if (result.status === "error") {
                toast.error(result.message);
                return;
            }

            await updateInfoMedical({
                username: data.username,
                phone: data.phone,
                address: data.address,
                specialization: data.specialization,
                credentials: data.credentials,
                experience: data.experience,
                institutionName: data.institutionName,
                status: "PENDING",
                userId: result.data.id
            })

            const Login: { status: string; message: string } = await loginWithCredential(data.email, data.password);
            if (Login.status === "error") {
                toast.error(result.message);
                return;
            }
            toast.success(result.message);
            router.push("/register/medical-staff/status");
        } catch (error) {
            toast.error("Terjadi kesalahan saat mendaftar");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-2 py-4">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <Link href="/" className="flex items-center gap-2">
                        <ArrowLeft size={16} />
                        <span className="text-sm">Home</span>
                    </Link>
                    <CardTitle className='text-center text-xl'>Daftar Sebagai Tenaga Medis</CardTitle>
                    <CardDescription className='text-center'>
                        Bergabung dengan MyDoc sebagai tenaga medis
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nama Lengkap</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Masukkan nama lengkap" {...field} />
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
                                                <Input placeholder="example@gmail.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Masukkan username" {...field} />
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
                                            <FormLabel>No Telepon</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Masukkan no telepon" {...field} />
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
                                            <FormLabel>Spesialisasi</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Contoh: Dokter Umum, Dokter Gigi, dll" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="credentials"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Pendidikan Terakhir</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Contoh: S1 Kedokteran Umum" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="experience"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Pengalaman Terakhir/Sekarang</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Contoh: Dokter Umum RS Medika" {...field} />
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
                                            <FormLabel>Rumah Sakit/Perusahaan Terakhir</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Contoh: RS Medika" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={form.control}
                                name="address"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Alamat</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Masukkan alamat lengkap" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Masukkan password"
                                                    {...field}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Konfirmasi Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    placeholder="Konfirmasi password"
                                                    {...field}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                >
                                                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button type="submit" className="w-full text-base" disabled={isSubmitting}>
                                {isSubmitting ? "Memuat..." : "Daftar"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
                <CardFooter className="flex justify-center text-sm text-muted-foreground">
                    Sudah punya akun ?
                    <Link href="/login" className="text-sm ms-1 text-muted-foreground hover:text-primary hover:underline">
                        Masuk
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
