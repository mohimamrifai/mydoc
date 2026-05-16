import { auth } from "@/auth";
import MedicalStaffDashboard, { MedicalStaffDashboardProps } from "@/components/shared/medical-staff-dashboard";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function MedicalStaffPage() {
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

  if(accountIsAcvtived?.medicalStaffInfo?.status !== "ACTIVE" ){
    redirect('/register/medical-staff/status')
  }

  // Get total products (videos) for this medical staff
  const totalProducts = await prisma.video.count({
    where: {
      uploadedById: session.user.id,
      status: "APPROVED" // Only count approved videos
    }
  });

  // Get monthly sales data
  const currentDate = new Date();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  
  const monthlySales = await prisma.order.count({
    where: {
      video: {
        uploadedById: session.user.id
      },
      createdAt: {
        gte: firstDayOfMonth
      }
    }
  });

  // Get monthly revenue
  const monthlyRevenue = await prisma.order.aggregate({
    where: {
      video: {
        uploadedById: session.user.id
      },
      createdAt: {
        gte: firstDayOfMonth
      }
    },
    _sum: {
      amount: true
    }
  });

  // Get previous month data for growth rate
  const prevMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const prevMonthRevenue = await prisma.order.aggregate({
    where: {
      video: {
        uploadedById: session.user.id
      },
      createdAt: {
        gte: prevMonthStart,
        lt: firstDayOfMonth
      }
    },
    _sum: {
      amount: true
    }
  });

  // Calculate growth rate
  const currentMonthRev = monthlyRevenue._sum.amount || 0;
  const prevMonthRev = prevMonthRevenue._sum.amount || 0;
  const growthRate = prevMonthRev === 0 ? 0 : ((currentMonthRev - prevMonthRev) / prevMonthRev) * 100;

  // Get last 6 months sales overview
  const sixMonthsAgo = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1);
  const salesByMonth = await prisma.order.groupBy({
    by: ['createdAt'],
    where: {
      video: {
        uploadedById: session.user.id
      },
      createdAt: {
        gte: sixMonthsAgo
      }
    },
    _sum: {
      amount: true
    }
  });

  // Format sales overview data
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const salesOverview = salesByMonth.map(sale => ({
    month: months[new Date(sale.createdAt).getMonth()],
    sales: 0, // We don't track individual sales count in this query
    revenue: sale._sum.amount || 0
  }));

  const formattedData: MedicalStaffDashboardProps = {
    totalProductData: { 
      value: totalProducts, 
      description: "Total approved videos in your channel" 
    },
    monthlySalesData: { 
      value: monthlySales, 
      description: "Total sales this month" 
    },
    monthlyRevenueData: { 
      value: Math.round(currentMonthRev), 
      description: "Total revenue this month" 
    },
    growthRateData: { 
      value: Math.round(growthRate * 100) / 100, 
      description: "Revenue growth from last month" 
    },
    salesOverviewData: salesOverview,
    salesOverviewRangeData: `Last 6 months overview`,
  }

  return (
    <div className="space-y-6 px-2 mt-2">
      <MedicalStaffDashboard {...formattedData} />
    </div>
  );
}
