"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { markAsRead } from "@/lib/actions/mark-as-read";
import { deleteNotification } from "@/lib/actions/delete-notification";
import { useRouter } from "next/navigation";


interface Notification {
    id: string;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
}

export default function MedicalStaffNotificationPage({ notifications }: { notifications: Notification[] }) {
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [notificationList, setNotificationList] = useState(notifications);
    const router = useRouter();

    const handleMarkAsRead = async () => {
        if (!selectedNotification) return;

        try {
            const result = await markAsRead(selectedNotification.id);
            if (result.success) {
                toast.success("Notification marked as read");
                setNotificationList(prev => prev.map(n =>
                    n.id === selectedNotification.id ? { ...n, isRead: true } : n
                ));
            } else {
                toast.error("Failed to mark notification as read");
            }
        } catch (error) {
            toast.error("Failed to mark notification as read");
        }
    };

    const handleDeleteNotification = async (id: string) => {
        try {
            const result = await deleteNotification(id);
            if (result.success) {
                toast.success("Notification deleted successfully");
                setNotificationList(prev => prev.filter(n => n.id !== id));
                setIsDialogOpen(false);
            } else {
                toast.error("Failed to delete notification");
            }
        } catch (error) {
            toast.error("Failed to delete notification");
        }
    };

    const handleDeleteAllNotifications = async () => {
        try {
            const notificationIds = notificationList.map(n => n.id);
            const result = await deleteNotification(notificationIds);
            if (result.success) {
                toast.success("All notifications deleted successfully");
                setNotificationList([]);
                setIsDialogOpen(false);
                router.refresh();
            } else {
                toast.error("Failed to delete notifications");
            }
        } catch (error) {
            toast.error("Failed to delete notifications");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-base font-bold">All Notifications</h1>
                {notificationList.length > 0 && (
                    <Button
                        variant="destructive"
                        onClick={handleDeleteAllNotifications}
                    >
                        Delete All
                    </Button>
                )}
            </div>

            <div className="space-y-4">
                {notificationList.map((notification) => (
                    <div
                        onClick={() => {
                            setSelectedNotification(notification);
                            setIsDialogOpen(true);
                        }}
                        key={notification.id}
                        className={cn(
                            "p-4 rounded-lg transition-colors",
                            notification.isRead
                                ? "bg-secondary/50 hover:bg-secondary/70"
                                : "bg-primary/10 hover:bg-primary/20"
                        )}
                    >
                        <div
                            className="flex items-center justify-between cursor-pointer"
                        >
                            <h3 className={cn(
                                "text-lg",
                                !notification.isRead && "font-semibold"
                            )}>
                                {notification.title}
                            </h3>
                            <span className="text-sm text-muted-foreground">
                                {format(new Date(notification.createdAt), 'MMM dd, yyyy HH:mm')}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {notification.message}
                        </p>
                        <div className="mt-2 flex justify-end">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteNotification(notification.id);
                                }}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                {selectedNotification && (
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>{selectedNotification.title}</DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                            <p className="text-sm text-muted-foreground mb-4">
                                {format(new Date(selectedNotification.createdAt), 'MMMM dd, yyyy HH:mm')}
                            </p>
                            <p className="whitespace-pre-wrap">
                                {selectedNotification.message}
                            </p>
                        </div>
                        <DialogFooter className="flex gap-2">
                            {!selectedNotification.isRead && (
                                <Button onClick={handleMarkAsRead}>
                                    Tandai Sudah Dibaca
                                </Button>
                            )}
                            <Button
                                variant="destructive"
                                onClick={() => handleDeleteNotification(selectedNotification.id)}
                            >
                                Delete
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                )}
            </Dialog>
        </div>
    );
}
