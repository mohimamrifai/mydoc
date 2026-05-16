import { auth } from "@/auth";
import AvatarUserButton from "./avatar-user-button";
import { NotificationBell } from "./notification-bell";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function Header() {
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
        <header className="sticky top-0 z-10 border-b bg-background px-4 py-3">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <h1 className="text-xs md:text-lg font-bold tracking-tight">👋 Hello, Welcome back! ✨</h1>
                </div>

                <div className="flex items-center gap-3">
                    <NotificationBell notifications={notifications} />
                    <AvatarUserButton user={session?.user} />
                </div>
            </div>
        </header>
    )
}
