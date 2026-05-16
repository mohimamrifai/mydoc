import { Button } from "@/components/ui/button";
import { AdminColumns, columns } from "./columns";
import { DataTable } from "./data-table";
import { prisma } from "@/lib/prisma";  
import { FormCreateAdmin } from "@/components/forms/form-create-admin";

const ListAdminsPage = async () => {

    const admins = await prisma.user.findMany({
        where: {
            role: "ADMIN"
        }
    })

    const formattedData: AdminColumns[] = admins.map((admin) => ({
        id: admin.id,
        name: admin.name || "",
        email: admin.email
    }))

    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-4">
                <h1 className="text-xl font-bold">Admin List</h1>
                <FormCreateAdmin />
            </div>
            <DataTable columns={columns} data={formattedData} />
        </div>
    );
};

export default ListAdminsPage;