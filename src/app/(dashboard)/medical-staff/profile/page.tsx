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
        include: {
            medicalStaffInfo: true
        }
    });

    if (userData?.medicalStaffInfo?.status !== "ACTIVE") {
        redirect('/register/medical-staff/status')
    }

    const formatteddata = {
        id: userData?.id || "",
        name: userData?.name || "",
        email: userData?.email || "",
        image: userData?.image || "",
        medicalInfo: userData.medicalStaffInfo ? userData.medicalStaffInfo : null
    }

    return (
        <AdminProfileComponent user={formatteddata} />
    );
}
