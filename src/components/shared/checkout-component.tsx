"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Video } from "@prisma/client"
import { useSession, signIn } from "next-auth/react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { register } from "@/lib/actions/register"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { createTransaction } from "@/lib/actions/payment"

interface CheckoutComponentProps {
    video: Video,
}

export default function CheckoutComponent({video }: CheckoutComponentProps) {
    const session = useSession()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingCheckout, setIsLoadingCheckout] = useState(false)

    const handleCheckout = async () => {
        try {
            setIsLoadingCheckout(true)
            const { token } = await createTransaction(video.id)
            window.snap.pay(token)
        } catch (error) {
            toast.error("An error occurred during checkout")
        } finally {
            setIsLoadingCheckout(false)
        }
    }

    const handleRegister = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            setIsLoading(true)
            if (password !== confirmPassword) {
                toast.error("Password tidak sama")
                return
            }

            const formattedData = {
                name,
                email,
                password
            }

            const result = await register(formattedData)
            if (result.status === "success") {
                toast.success(result.message)
                await signIn("credentials", {
                    email,
                    password,
                    redirect: false
                })
                router.refresh()
                router.push("/product/checkout/" + video.id)
                window.location.reload()
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error("Terjadi kesalahan")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Informasi Pengguna</h2>
                    {session.data ? (
                        <div className="space-y-4">
                            <div>
                                <Label>Nama</Label>
                                <Input value={session.data?.user?.name || ''} disabled />
                            </div>
                            <div>
                                <Label>Email</Label>
                                <Input value={session.data?.user?.email || ''} disabled />
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <form onSubmit={handleRegister} className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Nama</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="relative">
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                                <div className="relative">
                                    <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="absolute right-0 top-0"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Daftar"}
                                </Button>
                            </form>
                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">Sudah punya akun?</p>
                                <Button
                                    asChild
                                    variant="link"
                                    className="p-0 h-auto"
                                >
                                    <Link href="/login">
                                        Login di sini
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>

                <Card className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Informasi Produk</h2>
                    {video && (
                        <div className="space-y-4">
                            <div>
                                <Label>Judul Video</Label>
                                <p className="mt-1">{video.title}</p>
                            </div>
                            <div>
                                <Label>Harga</Label>
                                <p className="mt-1">Rp {video.price?.toLocaleString()}</p>
                            </div>
                            <Button
                                className="w-full"
                                disabled={!session.data}
                                onClick={handleCheckout}
                            >
                                {isLoadingCheckout ? <Loader2 className="h-4 w-4 animate-spin" /> : "Beli Sekarang"}
                            </Button>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
