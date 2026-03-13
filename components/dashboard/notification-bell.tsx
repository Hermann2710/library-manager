"use client";

import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getMyNotifications, markAsRead, markAllAsRead } from "@/actions/notification-actions";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Props {
    userId: string;
    role: string;
}

export function NotificationBell({ userId, role }: Props) {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const router = useRouter();

    const fetchNotifications = async () => {
        const data = await getMyNotifications(userId, role);
        setNotifications(data);
        setUnreadCount(data.filter((n: any) => !n.isRead).length);
    };

    useEffect(() => {
        fetchNotifications();
        // Optionnel : Polling toutes les 30 secondes pour les nouvelles notifications
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [userId, role]);

    const handleMarkAsRead = async (id: string, link?: string) => {
        await markAsRead(id);
        await fetchNotifications();
        if (link) router.push(link);
    };

    const handleMarkAllAsRead = async () => {
        await markAllAsRead(userId, role);
        await fetchNotifications();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0 text-[10px]"
                        >
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex justify-between items-center">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="text-xs text-primary hover:underline font-normal"
                        >
                            Tout marquer comme lu
                        </button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                            Aucune notification
                        </div>
                    ) : (
                        notifications.slice(0, 5).map((notification) => (
                            <DropdownMenuItem
                                key={notification._id}
                                className={`flex flex-col items-start p-3 cursor-pointer ${!notification.isRead ? "bg-muted/50" : ""}`}
                                onClick={() => handleMarkAsRead(notification._id, notification.link)}
                            >
                                <div className="flex justify-between w-full items-start gap-2">
                                    <span className={`font-semibold text-sm ${!notification.isRead ? "text-primary" : ""}`}>
                                        {notification.title}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: fr })}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                                    {notification.message}
                                </p>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>

                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="w-full text-center justify-center cursor-pointer font-medium p-2">
                    <Link href="/dashboard/notifications">
                        Voir toutes les notifications
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}