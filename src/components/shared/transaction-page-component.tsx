"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";

export interface Transaction {
    id: string;
    amount: number;
    status: "PENDING" | "COMPLETED" | "CANCELLED";
    createdAt: string;
    video: {
        title: string;
        price: number;
    };
}

export interface TransactionComponentProps {
    transactions: Transaction[];
}

export default function TransactionPageComponent({ transactions }: TransactionComponentProps) {
    const [mounted, setMounted] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all");
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setMounted(true);
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    if (!mounted) return null;

    const getStatusColor = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return "bg-green-100 text-green-700";
            case "PENDING":
                return "bg-yellow-100 text-yellow-700";
            case "CANCELLED":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return "Completed";
            case "PENDING":
                return "Pending";
            case "CANCELLED":
                return "Cancelled";
            default:
                return status;
        }
    };

    const filteredTransactions = statusFilter === "all"
        ? transactions
        : transactions.filter(t => t.status === statusFilter);


    return (
        <div className="container mx-auto p-3">
            <div className="mb-4">
                <h1 className="text-2xl font-bold">Riwayat Transaksi</h1>
                <p className="text-muted-foreground">Daftar transaksi yang telah Anda lakukan</p>
            </div>

            <div className={`mb-6 ${isMobile ? 'flex flex-wrap' : 'flex'} gap-2`}>
                <button
                    onClick={() => setStatusFilter("all")}
                    className={`px-4 py-2 rounded-lg ${isMobile ? 'flex-1 min-w-[45%]' : ''} ${statusFilter === "all"
                        ? "bg-primary text-white"
                        : "bg-gray-100"
                        }`}
                >
                    Semua
                </button>
                <button
                    onClick={() => setStatusFilter("COMPLETED")}
                    className={`px-4 py-2 rounded-lg ${isMobile ? 'flex-1 min-w-[45%]' : ''} ${statusFilter === "COMPLETED"
                        ? "bg-green-600 text-white"
                        : "bg-gray-100"
                        }`}
                >
                    Completed
                </button>
                <button
                    onClick={() => setStatusFilter("PENDING")}
                    className={`px-4 py-2 rounded-lg ${isMobile ? 'flex-1 min-w-[45%]' : ''} ${statusFilter === "PENDING"
                        ? "bg-yellow-600 text-white"
                        : "bg-gray-100"
                        }`}
                >
                    Pending
                </button>
                <button
                    onClick={() => setStatusFilter("CANCELLED")}
                    className={`px-4 py-2 rounded-lg ${isMobile ? 'flex-1 min-w-[45%]' : ''} ${statusFilter === "CANCELLED"
                        ? "bg-red-600 text-white"
                        : "bg-gray-100"
                        }`}
                >
                    Cancelled
                </button>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${!isMobile && ''}`}>
                {filteredTransactions.map((transaction) => (
                    <Link href={`/transaction?order_id=${transaction.id}&status_code=${200}&transaction_status=${transaction.status.toLowerCase()}`} key={transaction.id}>
                        <Card className="hover:bg-gray-100 transition-colors duration-200">
                            <CardHeader className="pb-3">
                                <div className={`${isMobile ? 'flex flex-col gap-2' : 'flex justify-between items-center'}`}>
                                    <CardTitle className="text-lg">Order #{transaction.id}</CardTitle>
                                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(transaction.status)} ${isMobile ? 'self-start' : ''}`}>
                                        {getStatusLabel(transaction.status)}
                                    </span>
                                </div>
                                <CardDescription>
                                    {new Date(transaction.createdAt).toLocaleDateString('id-ID')}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className={`${isMobile ? 'flex flex-col gap-1' : 'flex justify-between items-center'} text-sm`}>
                                        <div>
                                            <span className="font-medium">{transaction.video.title}</span>
                                        </div>
                                        <div>Rp {transaction.video.price.toLocaleString()}</div>
                                    </div>
                                    <div className={`pt-3 border-t ${isMobile ? 'flex flex-col gap-3' : 'flex justify-between items-center'}`}>
                                        <div className="space-y-1">
                                            <div className="text-sm text-muted-foreground">Status Pembayaran:</div>
                                            <div className={`font-medium w-max text-${getStatusColor(transaction.status)}`}>
                                                {getStatusLabel(transaction.status)}
                                            </div>
                                        </div>
                                        <div className={isMobile ? '' : 'text-right'}>
                                            <div className="text-sm text-muted-foreground">Total Pembayaran</div>
                                            <div className="font-medium">Rp {transaction.amount.toLocaleString()}</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
