import { BannerStatus } from "@prisma/client";
import { columns, BannerColumns } from "./columns";
import { DataTable } from "./data-table";
import FormCreateBanner from "@/components/forms/form-create-banner";
import { prisma } from "@/lib/prisma";

const ListBannersPage = async () => {

    const banners = await prisma.banner.findMany();

    const formattedBanners: BannerColumns[] = banners.map((banner) => ({
        id: banner.id,
        title: banner.title,
        description: banner.description,
        image: banner.imageUrl,
        status: banner.status as BannerStatus,
    }));

    return (
        <div className="p-4">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-2 mb-4">
                <h1 className="text-xl font-bold">Banner List</h1>
                <FormCreateBanner />
            </div>
            <DataTable columns={columns} data={formattedBanners} />
        </div>
    );
};

export default ListBannersPage;