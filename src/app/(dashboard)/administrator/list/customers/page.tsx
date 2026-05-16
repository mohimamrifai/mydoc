import { Button } from "@/components/ui/button";
import { columns, CustomerColumns } from "./columns";
import { DataTable } from "./data-table";
import { prisma } from "@/lib/prisma";

const ListCustomersPage = async () => {

    const data = await prisma.user.findMany({
        where: {
            role: "CUSTOMER"
        },
        include: {
            orders: {
                include: {
                    video: true
                }
            }
        }
    })

    const formattedData: CustomerColumns[] = data.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        image: item.image,
        jumlahOrder: item.orders.length,
        totalSpent: item.orders.reduce((total, order) => total + order.amount, 0)
    }))

    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-4">
                <h1 className="text-xl font-bold">Customer List</h1>
                <Button>Add Customer</Button>
            </div>
            <DataTable columns={columns} data={formattedData} />
        </div>
    );
};

export default ListCustomersPage;