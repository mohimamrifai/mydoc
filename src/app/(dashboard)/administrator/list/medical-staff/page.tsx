import { DataTable } from "./data-table";
import { columns, MedicalStaffColumns } from "./columns";
import { FormCreateMedicalStaff } from "@/components/forms/form-create-medical-staff";
import { prisma } from "@/lib/prisma";
import { StatusMedical } from "@prisma/client";

const ListMedicalStaffPage = async () => {


    const data = await prisma.user.findMany({
        where: {
            role: "MEDICAL_STAFF"
        },
        include: {
            videos: true,
            medicalStaffInfo: true
        }
    })

    const formattedData: MedicalStaffColumns[] = data.map((item) => ({
        id: item.id,
        name: item.name || "",
        email: item.email,
        jumlahProdukDisetujui: item.videos.filter((video) => video.status === "APPROVED").length,
        jumlahProdukDitolak: item.videos.filter((video) => video.status === "REJECTED").length,
        jumlahProdukMenunggu: item.videos.filter((video) => video.status === "PENDING").length,
        statusAkun: item.medicalStaffInfo?.status!
    }))

    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-4">
                <h1 className="text-xl font-bold">Medical Staff List</h1>
                <FormCreateMedicalStaff />
            </div>
            <div className="w-[250px] md:w-full">
                <DataTable columns={columns} data={formattedData} />
            </div>
        </div>
    );
};

export default ListMedicalStaffPage;