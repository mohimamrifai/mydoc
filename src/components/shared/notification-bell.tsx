"use client"
import { Button } from "../ui/button";
import { Bell } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useEffect, useState } from "react";
import { Notification } from "@prisma/client";
import Link from "next/link";
import { markAsRead } from "@/lib/actions/mark-as-read";
import { toast } from "sonner";
interface NotificationBellProps {
    notifications: Notification[];
}

export const NotificationBell = ({ notifications }: NotificationBellProps) => {
    const [open, setOpen] = useState(false);

    const handleMarkAllAsRead = async () => {
        try {
            const result = await markAsRead(notifications.map(n => n.id));
            if (result.success) {
                toast.success("All notifications marked as read");
            }
        } catch (error) {
            toast.error("Failed to mark all notifications as read");
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="relative rounded-full">
                    <Bell className="h-4 w-4" />
                    {notifications.some(n => !n.isRead) && (
                        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500" />
                    )}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Notifications</DialogTitle>
                </DialogHeader>
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-[50vh]">
                        <p className="text-sm text-muted-foreground">No notifications</p>
                    </div>
                ) : (
                    <ScrollArea className="h-[50vh] w-full pr-4">
                        <div className="flex flex-col gap-2">
                        {notifications.map((notification) => (
                            <Link 
                                href={`/notifications`}
                                key={notification.id} 
                                className={`p-3 rounded-lg border ${
                                    notification.isRead ? 'bg-background' : 'bg-muted'
                                }`}
                            >
                                <h4 className="font-semibold">{notification.title}</h4>
                                <p className="text-sm text-muted-foreground">{notification.message}</p>
                                <span className="text-xs text-muted-foreground">
                                    {new Date(notification.createdAt).toLocaleDateString()}
                                </span>
                            </Link>
                        ))}
                        </div>
                    </ScrollArea>
                )}
                <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={handleMarkAllAsRead}
                >
                    Mark all as read
                </Button>
            </DialogContent>
        </Dialog>
    )
}
