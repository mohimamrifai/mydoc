"use client"

import { CardDescription, CardTitle, CardHeader, CardContent, Card } from "../ui/card";
import { ShoppingCart, Package, FileText, TrendingUp } from "lucide-react";
import CardInfo from "./card-info";
import { BarChart, Bar, XAxis, CartesianGrid, YAxis, ResponsiveContainer, LabelList } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useState, useEffect } from "react";

const chartConfig = {
    sales: {
        label: "Sales",
        color: "hsl(var(--chart-1))"
    },
    revenue: {
        label: "Revenue",
        color: "hsl(var(--chart-2))"
    }
} satisfies ChartConfig;

export interface MedicalStaffDashboardProps {
    totalProductData: {
        value: number;
        description: string;
    };
    monthlySalesData: {
        value: number;
        description: string;
    };
    monthlyRevenueData: {
        value: number;
        description: string;
    };
    growthRateData: {
        value: number;
        description: string;
    };
    salesOverviewData: {
        month: string;
        sales: number;
        revenue: number;
    }[];
    salesOverviewRangeData: string;
}

export default function MedicalStaffDashboard({ totalProductData, monthlySalesData, monthlyRevenueData, growthRateData, salesOverviewData, salesOverviewRangeData }: MedicalStaffDashboardProps) {
    const [mounted, setMounted] = useState(false);
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

    if (!mounted) {
        return null;
    }
    return (
        <div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <CardInfo
                    title="Total Products"
                    value={totalProductData.value}
                    icon={<Package className="h-4 w-4 text-muted-foreground" />}
                    description={totalProductData.description}
                />

                <CardInfo
                    title="Monthly Sales"
                    value={monthlySalesData.value}
                    icon={<ShoppingCart className="h-4 w-4 text-muted-foreground" />}
                    description={monthlySalesData.description}
                />

                <CardInfo
                    title="Monthly Revenue"
                    value={monthlyRevenueData.value}
                    icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                    description={monthlyRevenueData.description}
                />

                <CardInfo
                    title="Growth Rate"
                    value={growthRateData.value}
                    icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
                    description={growthRateData.description}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 mt-2 md:mt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Sales Overview</CardTitle>
                        <CardDescription>{salesOverviewRangeData}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isMobile ? (
                            <div className="space-y-4">
                                {salesOverviewData.map((data, index) => (
                                    <div key={index} className="flex justify-between items-center border-b pb-2">
                                        <div>
                                            <div className="font-medium">{data.month}</div>
                                            <div className="text-sm text-muted-foreground">
                                                Revenue: {(data.revenue / 1000000).toFixed(1)}jt
                                            </div>
                                        </div>
                                        <div className={`text-sm ${data.revenue > salesOverviewData[index - 1]?.revenue ? 'text-green-500' : 'text-red-500'}`}>
                                            {data.revenue > salesOverviewData[index - 1]?.revenue ? '↑' : '↓'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <ChartContainer config={chartConfig}>
                                <div style={{ width: '100%', height: 300 }}>
                                    <ResponsiveContainer>
                                        <BarChart accessibilityLayer data={salesOverviewData}>
                                            <CartesianGrid vertical={false} />
                                            <XAxis
                                                dataKey="month"
                                                tickLine={false}
                                                tickMargin={10}
                                                axisLine={false}
                                                tickFormatter={(value) => value.slice(0, 3)}
                                            />
                                            <YAxis
                                                tickLine={false}
                                                tickMargin={10}
                                                axisLine={false}
                                                tickFormatter={(value) => {
                                                    if (value >= 1000000) {
                                                        return `${value / 1000000}jt`;
                                                    }
                                                    return value;
                                                }}
                                            />
                                            <ChartTooltip
                                                cursor={false}
                                                content={<ChartTooltipContent indicator="dashed" />}
                                            />
                                            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4}>
                                                <LabelList
                                                    dataKey="revenue"
                                                    position="top"
                                                    formatter={(value: number) => {
                                                        if (value >= 1000000) {
                                                            return `${value / 1000000}jt`;
                                                        }
                                                        return value;
                                                    }}
                                                />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </ChartContainer>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
