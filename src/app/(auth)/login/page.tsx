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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { loginWithGoogle } from '@/lib/actions/login-with-google';
import { loginWithCredential } from '@/lib/actions/login-with-credential';
import { useSession } from 'next-auth/react';
const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
});

const mapRoleToDashboard = {
    "ADMINISTRATOR": "/administrator",
    "ADMIN": "/admin",
    "MEDICAL_STAFF": "/medical-staff",
    "CUSTOMER": "/user"
}

export default function Login() {
    const session = useSession();
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const isSubmitting = form.formState.isSubmitting;

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const result: { status: string; message: string } = await loginWithCredential(data.email, data.password);
        if (result.status === "error") {
            toast.error(result.message);
            return;
        }

        router.refresh();
    };

    const handleGoogleLogin = async () => {
        await loginWithGoogle();
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-2">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <Link href="/" className="flex items-center gap-2">
                        <ArrowLeft size={16} />
                        <span className="text-sm">Home</span>
                    </Link>
                    <CardTitle className='text-center text-xl'>Login</CardTitle>
                    <CardDescription className='text-center'>
                        Masuk ke akun MyDoc Anda
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
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
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? 'text' : 'password'}
                                                    placeholder="Masukkan password"
                                                    className='mb-4'
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
                            <Button
                                type="submit"
                                className="w-full text-base"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Loading..." : "Masuk"}
                            </Button>
                        </form>
                    </Form>

                    <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-background px-2 text-muted-foreground">
                                Atau lanjutkan dengan
                            </span>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={handleGoogleLogin}
                    >
                        <>
                            <svg
                                className="mr-2 h-4 w-4"
                                aria-hidden="true"
                                focusable="false"
                                data-prefix="fab"
                                data-icon="google"
                                role="img"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 488 512"
                            >
                                <path
                                    fill="currentColor"
                                    d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                                ></path>
                            </svg>
                            Google
                        </>
                    </Button>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Link href="/forgot-password" className="text-sm text-muted-foreground hover:text-primary hover:underline">
                        Lupa password?
                    </Link>
                    <Link href="/register" className="text-sm text-muted-foreground hover:text-primary hover:underline">
                        Daftar
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
