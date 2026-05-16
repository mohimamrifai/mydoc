import { Button } from "@/components/ui/button";
import { columns, OrderColumns } from "./columns";
import { DataTable } from "./data-table";
import { prisma } from "@/lib/prisma";
import { OrderStatus } from "@prisma/client";

const dataDummy = [
    {
        id: "dhbsfvurehfvbierauf",
        orderNumber: "1234567890",
        customerName: "John Doe",
        totalAmount: 100,
        status: "PENDING" as OrderStatus,
        orderDate: "2021-01-01"
    },
    {
        id: "dhbsfdsahfbiurefe",
        orderNumber: "1234567890",
        customerName: "John Doe",
        totalAmount: 100,
        status: "PENDING" as OrderStatus,
        orderDate: "2021-01-01"
    }
]

const ListOrdersPage = async () => {
    const orders = await prisma.order.findMany({
        include: {
            user: true,
            video: true
        }
    });

    const formattedOrders: OrderColumns[] = orders.map((order) => ({
        id: order.id,
        orderNumber: order.id,
        customerName: order.user.name ?? 'Unknown Customer',
        totalAmount: order.amount,
        status: order.status as OrderStatus,
        orderDate: order.createdAt.toLocaleDateString()
    }));

    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-4">
                <h1 className="text-xl font-bold">Order List</h1>
            </div>
            <DataTable columns={columns} data={formattedOrders} />
        </div>
    );
};

export default ListOrdersPage;