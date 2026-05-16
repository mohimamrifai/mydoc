import { redirect } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma"

export default async function StatusPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    const accountIsAcvtived = await prisma.user.findFirst({
        where: {
            id: session.user.id
        },
        include: {
            medicalStaffInfo: true
        }
    })

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-2">
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <Link href="/" className="flex items-center gap-2">
                        <ArrowLeft size={16} />
                        <span className="text-sm">Home</span>
                    </Link>
                    <CardTitle className="text-center text-xl">Status Pendaftaran</CardTitle>
                    <CardDescription className="text-center">
                        Status pendaftaran akun tenaga medis Anda
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="rounded-lg border p-4">
                        <h3 className="text-lg font-medium">Status Akun:</h3>
                        <div className="mt-2">
                            {accountIsAcvtived?.medicalStaffInfo?.status === "PENDING" && (
                                <div className="text-yellow-600">
                                    ⏳ Menunggu Verifikasi Admin
                                </div>
                            )}
                            {accountIsAcvtived?.medicalStaffInfo?.status === "ACTIVE" && (
                                <div className="text-green-600">
                                    ✅ Akun Telah Diverifikasi
                                </div>
                            )}
                            {accountIsAcvtived?.medicalStaffInfo?.status === "INACTIVE" && (
                                <div className="text-red-600">
                                    ❌ Akun Ditolak
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="text-center text-sm text-muted-foreground mb-2">
                        Mohon tunggu verifikasi dari admin. Proses verifikasi membutuhkan waktu maksimal 2 x 24 jam,
                        mohon cek secara berkala untuk mengetahui status akun Anda.
                    </div>

                </CardContent>
                <Link href="/" className="w-full mt-2">
                    <Button className="w-full">
                        Kembali ke Beranda
                    </Button>
                </Link>
            </Card>
        </div>
    );
}