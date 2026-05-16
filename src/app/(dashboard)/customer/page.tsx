import CustomerDashboard, { CustomerDashboardProps } from "@/components/shared/customer-dashboard";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function CustomerPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    // Get all orders for the user
    const orders = await prisma.order.findMany({
        where: {
            userId: session.user.id
        },
        include: {
            video: true
        }
    });

    // Calculate totals
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((acc, order) => acc + order.amount, 0);
    const totalItems = orders.length; // Since each order is for 1 video

    // Get recent purchases
    const recentPurchases = orders.map(order => ({
        id: order.id,
        date: order.createdAt.toISOString(),
        product: order.video.title,
        quantity: 1,
        total: order.amount
    })).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const formattedData: CustomerDashboardProps = {
        totalOrders,
        totalItems,
        totalSpent,
        recentPurchases
    };

    return (
        <CustomerDashboard {...formattedData} />
    );
}
