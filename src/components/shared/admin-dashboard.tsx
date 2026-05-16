"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Stethoscope, User, FileText, DollarSign, TrendingUp, Package } from "lucide-react";
import { BarChart, Bar, XAxis, CartesianGrid, PieChart, Pie, Cell, LabelList, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useState, useEffect } from "react";
import CardInfo from "./card-info";



export interface AdminDashboardProps {
    medicalStaff: {
        total: number;
        description: string;
    },
    totalCustomers: {
        total: number;
        description: string;
    },
    monthlyRevenue: {
        total: number;
        description: string;
    },
    totalProducts: {
        total: number;
        description: string;
    },
    totalOrders: {
        total: number;
        description: string;
    },
    growthRate: {
        total: number;
        description: string;
    },
    ordersOverviewRange: string;
    ordersOverviewData: {
        month: string;
        orders: number;
        revenue: number;
    }[],
    revenueOverviewRange: string;
    revenueOverviewData: {
        month: string;
        orders: number;
        revenue: number;
    }[],
    topCategories: {
        category: string;
        value: number;
        fill: string;
    }[],
    recentActivity: {
        title: string;
        description: string;
        time: string;
    }[],
    growthRateCategory: string;
    chartConfig: ChartConfig;
}

export default function AdminDashboard({
    medicalStaff,
    totalCustomers,
    monthlyRevenue,
    totalProducts,
    totalOrders,
    growthRate,
    ordersOverviewRange,
    ordersOverviewData,
    revenueOverviewRange,
    revenueOverviewData,
    topCategories,
    growthRateCategory,
    recentActivity,
    chartConfig,
}: AdminDashboardProps) {

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
                    title="Medical Staff"
                    value={medicalStaff.total}
                    description={medicalStaff.description}
                    icon={<Stethoscope className="h-4 w-4 text-muted-foreground" />}
                />

                <CardInfo
                    title="Total Customers"
                    value={totalCustomers.total}
                    description={totalCustomers.description}
                    icon={<User className="h-4 w-4 text-muted-foreground" />}
                />

                <CardInfo
                    title="Monthly Revenue"
                    value={monthlyRevenue.total}
                    description={monthlyRevenue.description}
                    icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                />

                <CardInfo
                    title="Total Products"
                    value={totalProducts.total}
                    description={totalProducts.description}
                    icon={<Package className="h-4 w-4 text-muted-foreground" />}
                />

                <CardInfo
                    title="Total Orders"
                    value={totalOrders.total}
                    description={totalOrders.description}
                    icon={<FileText className="h-4 w-4 text-muted-foreground" />}
                />

                <CardInfo
                    title="Growth Rate"
                    value={growthRate.total}
                    description={growthRate.description}
                    icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2 mt-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Orders Overview</CardTitle>
                        <CardDescription>{ordersOverviewRange}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isMobile ? (
                            <div className="space-y-4">
                                {ordersOverviewData.map((data, index) => (
                                    <div key={index} className="flex justify-between items-center border-b pb-2">
                                        <div>
                                            <div className="font-medium">{data.month}</div>
                                            <div className="text-sm text-muted-foreground">Orders: {data.orders}</div>
                                        </div>
                                        <div className={`text-sm ${data.orders > ordersOverviewData[index - 1]?.orders ? 'text-green-500' : 'text-red-500'}`}>
                                            {data.orders > ordersOverviewData[index - 1]?.orders ? '↑' : '↓'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <ChartContainer config={chartConfig}>
                                <div style={{ width: '100%', height: 300 }}>
                                    <ResponsiveContainer>
                                        <BarChart accessibilityLayer data={ordersOverviewData}>
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
                                            />
                                            <ChartTooltip
                                                cursor={false}
                                                content={<ChartTooltipContent indicator="dashed" />}
                                            />
                                            <Bar dataKey="orders" fill="var(--color-orders)" radius={4}>
                                                <LabelList dataKey="orders" position="top" />
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </ChartContainer>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                        <CardDescription>{revenueOverviewRange}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isMobile ? (
                            <div className="space-y-4">
                                {revenueOverviewData.map((data, index) => (
                                    <div key={index} className="flex justify-between items-center border-b pb-2">
                                        <div>
                                            <div className="font-medium">{data.month}</div>
                                            <div className="text-sm text-muted-foreground">
                                                Revenue: {(data.revenue / 1000000).toFixed(1)}jt
                                            </div>
                                        </div>
                                        <div className={`text-sm ${data.revenue > revenueOverviewData[index - 1]?.revenue ? 'text-green-500' : 'text-red-500'}`}>
                                            {data.revenue > revenueOverviewData[index - 1]?.revenue ? '↑' : '↓'}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <ChartContainer config={chartConfig}>
                                <div style={{ width: '100%', height: 300 }}>
                                    <ResponsiveContainer>
                                        <BarChart accessibilityLayer data={revenueOverviewData}>
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

                {mounted && (
                    <Card className="flex flex-col">
                        <CardHeader className="items-center pb-0">
                            <CardTitle>Top Categories</CardTitle>
                            <CardDescription>Most Ordered Categories</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 pb-0 mt-2">
                            {isMobile ? (
                                <div className="space-y-4">
                                    {topCategories.map((category, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.fill }} />
                                                <span className="font-medium">{chartConfig[category.category as keyof typeof chartConfig]?.label}</span>
                                            </div>
                                            <div className="font-medium">{category.value}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <ChartContainer
                                    config={chartConfig}
                                    className="mx-auto [&_.recharts-text]:fill-foreground"
                                >
                                    <div style={{ width: '100%', height: 300 }}>
                                        <ResponsiveContainer>
                                            <PieChart>
                                                <ChartTooltip />
                                                <Pie
                                                    data={topCategories}
                                                    dataKey="value"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={80}
                                                    innerRadius={30}
                                                    paddingAngle={2}
                                                    nameKey="category"
                                                >
                                                    {topCategories.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                                    ))}
                                                </Pie>
                                                <Legend 
                                                    formatter={(value) => {
                                                        return chartConfig[value as keyof typeof chartConfig]?.label || value;
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </ChartContainer>
                            )}
                        </CardContent>
                        <CardFooter className="flex-col gap-2 text-sm mt-10">
                            <div className="flex items-center gap-2 font-medium leading-none">
                                {growthRateCategory} <TrendingUp className="h-4 w-4" />
                            </div>
                        </CardFooter>
                    </Card>
                )}
                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                {recentActivity.map((activity, index) => (
                                    <div key={index} className="space-y-4">
                                        <div className="flex items-center">
                                            <div className="space-y-1">
                                                <p className="text-sm font-medium leading-none">{activity.title}</p>
                                                <p className="text-sm text-muted-foreground">{activity.description}</p>
                                                <p className="text-xs text-muted-foreground">{activity.time}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
