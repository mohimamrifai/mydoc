import Navbar from "@/components/shared/navbar"
import Footer from "@/components/shared/footer"
import { redirect } from "next/navigation"
import { getTransaction } from "@/lib/actions/get-transaction"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2, XCircle, Clock } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"

export default async function TransactionPage({
    searchParams
}: {
    searchParams: Promise<{ order_id?: string, status_code?: string, transaction_status?: string }>
}) {
    const session = await auth()
    const { order_id, status_code, transaction_status } = await searchParams;

    if (!order_id || !status_code || !transaction_status) {
        redirect('/')
    }

    if (!session) {
        redirect('/login')
    }

    // cek apakah user tersebut benar memiliki order dengan id tersebut
    const order = await prisma.order.findUnique({
        where: {
            id: order_id,
            userId: session.user.id
        }
    })

    if (!order) {
        redirect('/')
    }

    const data = await getTransaction(order_id)
    const dataFromDb = await prisma.order.findUnique({
        where: {
            id: order_id
        }
    })

    // Map Midtrans status to OrderStatus enum
    const getOrderStatus = (transactionStatus: string) => {
        switch (transactionStatus.toLowerCase()) {
            case 'settlement':
                return 'COMPLETED'
            case 'pending':
                return 'PENDING'
            default:
                return 'CANCELLED'
        }
    }

    const mappedStatus = getOrderStatus(data?.transaction_status || '')
    const MatchStatus = mappedStatus !== dataFromDb?.status
    if (MatchStatus) {
        await prisma.order.update({
            where: {
                id: order_id
            },
            data: {
                status: mappedStatus
            }
        })
    }

    const getStatusIcon = () => {
        switch (data?.transaction_status) {
            case 'settlement':
                return <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16 text-green-500 mx-auto mb-4" />
            case 'pending':
                return <Clock className="w-12 h-12 md:w-16 md:h-16 text-yellow-500 mx-auto mb-4" />
            default:
                return <XCircle className="w-12 h-12 md:w-16 md:h-16 text-red-500 mx-auto mb-4" />
        }
    }

    const getStatusColor = () => {
        switch (data?.transaction_status) {
            case 'settlement':
                return 'text-green-500'
            case 'pending':
                return 'text-yellow-500'
            default:
                return 'text-red-500'
        }
    }

    const getStatusTitle = () => {
        switch (data?.transaction_status) {
            case 'settlement':
                return 'Pembayaran Berhasil'
            case 'pending':
                return 'Menunggu Pembayaran'
            default:
                return 'Pembayaran Gagal'
        }
    }

    const getStatusMessage = () => {
        switch (data?.transaction_status) {
            case 'settlement':
                return 'Terima kasih! Pembayaran Anda telah berhasil diproses.'
            case 'pending':
                return 'Silakan selesaikan pembayaran Anda sesuai dengan instruksi di bawah.'
            default:
                return 'Maaf, pembayaran Anda tidak dapat diproses.'
        }
    }

    return (
        <div className="mt-8">
            <Navbar />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-2 md:p-4">
                <Card className="w-full max-w-md p-4 md:p-6 space-y-4 md:space-y-6">
                    <div className="text-center">
                        {getStatusIcon()}
                        <h1 className={`text-lg md:text-xl font-bold ${getStatusColor()} mb-2`}>
                            {getStatusTitle()}
                        </h1>
                        <p className="text-gray-600 text-xs md:text-sm mb-4">{getStatusMessage()}</p>
                    </div>

                    <div className="bg-gray-100 p-3 md:p-4 rounded-lg space-y-2">
                        <div className="flex flex-col md:flex-row justify-between text-sm md:text-base">
                            <span className="text-gray-600">Order ID:</span>
                            <span className="font-medium text-xs md:text-sm">{data?.order_id}</span>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between text-sm md:text-base">
                            <span className="text-gray-600">Status Transaksi:</span>
                            <span className="font-medium capitalize">{data?.transaction_status === 'pending' ? 'Menunggu Pembayaran' : data?.transaction_status === 'settlement' ? 'Pembayaran Berhasil' : 'Pembayaran Gagal'}</span>
                        </div>
                        <div className="flex flex-col md:flex-row justify-between text-sm md:text-base">
                            <span className="text-gray-600">Total Pembayaran:</span>
                            <span className="font-medium">Rp {parseInt(data?.gross_amount || "0").toLocaleString('id-ID')}</span>
                        </div>
                        {data?.transaction_status === 'pending' && data?.va_numbers && data.va_numbers.length > 0 && (
                            <>
                                <div className="flex flex-col md:flex-row justify-between text-sm md:text-base">
                                    <span className="text-gray-600">Bank:</span>
                                    <span className="font-medium uppercase">{data.va_numbers[0].bank}</span>
                                </div>
                                <div className="flex flex-col md:flex-row justify-between text-sm md:text-base">
                                    <span className="text-gray-600">Nomor Virtual Account:</span>
                                    <span className="font-medium">{data.va_numbers[0].va_number}</span>
                                </div>
                                <div className="flex flex-col md:flex-row justify-between text-sm md:text-base">
                                    <span className="text-gray-600">Batas Waktu:</span>
                                    <span className="font-medium text-xs md:text-sm">{new Date(data?.expiry_time || "").toLocaleString('id-ID', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</span>
                                </div>
                            </>
                        )}
                        {data?.transaction_status === 'pending' && data?.biller_code && (
                            <>
                                <div className="flex flex-col md:flex-row justify-between text-sm md:text-base">
                                    <span className="text-gray-600">Kode Pembayaran:</span>
                                    <span className="font-medium">{data.biller_code}</span>
                                </div>
                                <div className="flex flex-col md:flex-row justify-between text-sm md:text-base">
                                    <span className="text-gray-600">Nomor Virtual Account:</span>
                                    <span className="font-medium">{data.bill_key}</span>
                                </div>
                                <div className="flex flex-col md:flex-row justify-between text-sm md:text-base">
                                    <span className="text-gray-600">Batas Waktu:</span>
                                    <span className="font-medium text-xs md:text-sm">{new Date(data?.expiry_time || "").toLocaleString('id-ID', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}</span>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row gap-2 md:gap-4">
                        <Link href="/" className="w-full">
                            <Button variant="outline" className="w-full text-sm md:text-base">
                                Kembali ke Beranda
                            </Button>
                        </Link>
                        <Link
                            href={`/transaction?order_id=${order_id}&status_code=${status_code}&transaction_status=${transaction_status}`}
                            className="w-full"
                        >
                            <Button className="w-full text-sm md:text-base">
                                Refresh
                            </Button>
                        </Link>
                    </div>
                </Card>
            </div>
            <Footer />
        </div>
    )
}
