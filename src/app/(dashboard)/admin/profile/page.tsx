import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminProfileComponent from "@/components/shared/admin-profile-page";

export default async function AdminProfilePage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const user = session.user;

    const userData = await prisma.user.findUnique({
        where: {
            id: user.id,
        },
    });

    const formatteddata = {
        id: userData?.id || "",
        name: userData?.name || "",
        email: userData?.email || "",
        image: userData?.image || "",
    }

    return (
        <AdminProfileComponent user={formatteddata} />
    );
}
