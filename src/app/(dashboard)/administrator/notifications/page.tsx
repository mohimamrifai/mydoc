import MedicalStaffNotificationPage from "@/components/shared/medical-staff-notification-page";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    const notifications = await prisma.notification.findMany({
        where: {
            userId: session.user.id,
        },
    });

    return (
        <div>
            <MedicalStaffNotificationPage notifications={notifications} />
        </div>
    )
}
