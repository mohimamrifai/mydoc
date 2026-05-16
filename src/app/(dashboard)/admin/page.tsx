import { auth } from "@/auth";
import AdminDashboard, { AdminDashboardProps } from "@/components/shared/admin-dashboard";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const fillColor = [
    "hsl(280, 100%, 50%)", // Vibrant purple
    "hsl(340, 100%, 50%)", // Hot pink
    "hsl(180, 100%, 40%)", // Turquoise
    "hsl(30, 100%, 50%)",  // Orange
    "hsl(140, 80%, 40%)"   // Forest green
]

export default async function AdminPage() {


  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Get total medical staff
  const medicalStaffCount = await prisma.user.count({
    where: { role: "MEDICAL_STAFF" }
  });

  // Get total customers
  const customersCount = await prisma.user.count({
    where: { role: "CUSTOMER" }
  });

  // Get monthly revenue
  const currentMonth = new Date().getMonth() + 1;
  const monthlyRevenue = await prisma.order.aggregate({
    where: {
      createdAt: {
        gte: new Date(new Date().getFullYear(), currentMonth - 1, 1),
        lt: new Date(new Date().getFullYear(), currentMonth, 1)
      }
    },
    _sum: {
      amount: true
    }
  });

  // Get total products (videos)
  const productsCount = await prisma.video.count();

  // Get total orders
  const ordersCount = await prisma.order.count();

  // Get orders data for last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const ordersData = await prisma.order.groupBy({
    by: ['createdAt'],
    where: {
      createdAt: {
        gte: sixMonthsAgo
      }
    },
    _sum: {
      amount: true
    },
    _count: true
  });

  // Calculate growth rate
  const previousMonthOrders = ordersData[ordersData.length - 2]?._count ?? 0;
  const currentMonthOrders = ordersData[ordersData.length - 1]?._count ?? 0;
  const growthRate = previousMonthOrders ?
    ((currentMonthOrders - previousMonthOrders) / previousMonthOrders) * 100 : 0;

  // Get top categories and calculate growth rate
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const previousMonthCategories = await prisma.category.count({
    where: {
      createdAt: {
        lt: new Date(new Date().getFullYear(), currentMonth - 1, 1)
      }
    }
  });

  const currentMonthCategories = await prisma.category.count();
  
  const categoryGrowthRate = previousMonthCategories ? 
    ((currentMonthCategories - previousMonthCategories) / previousMonthCategories) * 100 : 0;

  const topCategories = await prisma.category.findMany({
    include: {
      _count: {
        select: { videos: true }
      }
    },
    take: 5,
    orderBy: {
      videos: {
        _count: 'desc'
      }
    }
  });

  // Get recent activity (orders)
  const recentActivity = await prisma.order.findMany({
    include: {
      user: true,
      video: true
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 5
  });

  // Generate dynamic chart config based on categories
  const chartConfig = topCategories.reduce((config, category, index) => {
    config[category.name.toLowerCase()] = {
      label: category.name,
      color: fillColor[index]
    };
    return config;
  }, {} as Record<string, { label: string; color: string }>);

  const formattedData: AdminDashboardProps = {
    medicalStaff: {
      total: medicalStaffCount,
      description: "Total medical staff registered"
    },
    totalCustomers: {
      total: customersCount,
      description: "Total customers registered"
    },
    monthlyRevenue: {
      total: monthlyRevenue._sum.amount || 0,
      description: "Revenue this month"
    },
    totalProducts: {
      total: productsCount,
      description: "Total videos available"
    },
    totalOrders: {
      total: ordersCount,
      description: "Total orders made"
    },
    growthRate: {
      total: Math.round(growthRate),
      description: "Order growth from last month"
    },
    ordersOverviewRange: "Last 6 months",
    ordersOverviewData: ordersData.map(data => ({
      month: new Date(data.createdAt).toLocaleString('default', { month: 'long' }),
      orders: data._count,
      revenue: data._sum.amount || 0
    })),
    revenueOverviewRange: "Last 6 months",
    revenueOverviewData: ordersData.map(data => ({
      month: new Date(data.createdAt).toLocaleString('default', { month: 'long' }),
      orders: data._count,
      revenue: data._sum.amount || 0
    })),
    topCategories: topCategories.map((cat, idx) => ({
      category: cat.name.toLowerCase(),
      value: cat._count.videos,
      fill: fillColor[idx]
    })),
    recentActivity: recentActivity.map(activity => ({
      title: activity.video.title,
      description: `Ordered by ${activity.user.name}`,
      time: activity.createdAt.toLocaleString()
    })),
    growthRateCategory: `${Math.round(categoryGrowthRate)}% from last month`,
    chartConfig: chartConfig
  };

  return (
    <div className="space-y-6 px-2 mt-2">
      <AdminDashboard {...formattedData} />
    </div>
  );
}
