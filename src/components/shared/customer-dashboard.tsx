"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ShoppingCart, Package, FileText } from "lucide-react";


export interface CustomerDashboardProps {
    totalOrders: number;
    totalItems: number;
    totalSpent: number;
    recentPurchases: { id: string; date: string; product: string; quantity: number; total: number }[];
}

export default function CustomerDashboard({ totalOrders, totalItems, totalSpent, recentPurchases }: CustomerDashboardProps) {
    return (
        <div className="space-y-6 p-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalOrders}</div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">180</div>
                        <p className="text-xs text-muted-foreground">Across all orders</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Rp 2.450.000</div>
                        <p className="text-xs text-muted-foreground">All time purchases</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Purchases</CardTitle>
                    <CardDescription>Your latest transactions</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {recentPurchases.map((purchase) => (
                            <div key={purchase.id} className="flex justify-between items-center border-b pb-2">
                                <div>
                                    <div className="font-medium">{purchase.product}</div>
                                    <div className="text-sm text-muted-foreground">
                                        Order ID: {purchase.id} • {new Date(purchase.date).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-medium">Rp {purchase.total.toLocaleString()}</div>
                                    <div className="text-sm text-muted-foreground">Qty: {purchase.quantity}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
