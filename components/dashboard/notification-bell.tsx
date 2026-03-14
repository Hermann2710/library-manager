"use client";

import React, { useEffect, useState } from "react";
import { Bell, CheckCheck, Inbox } from "lucide-react";
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
import { cn } from "@/lib/utils";

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
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [userId, role]);

    const handleMarkAsRead = async (id: string, link?: string) => {
        await markAsRead(id);
        await fetchNotifications();
        if (link) router.push(link);
    };

    const handleMarkAllAsRead = async (e: React.MouseEvent) => {
        e.stopPropagation(); // Évite de fermer le menu par erreur
        await markAllAsRead(userId, role);
        await fetchNotifications();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-muted/60 transition-colors group"
                >
                    <Bell className="h-5 w-5 group-hover:text-primary transition-colors" />
                    {unreadCount > 0 && (
                        <Badge
                            className="absolute -top-1 -right-1 h-4 min-w-4 flex items-center justify-center rounded-full p-1 text-[9px] font-black border-2 border-background shadow-sm"
                        >
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-80 rounded-2xl border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl p-0 overflow-hidden"
            >
                <DropdownMenuLabel className="px-4 py-4 flex justify-between items-center bg-muted/10">
                    <span className="text-[10px] font-black uppercase italic tracking-[0.2em] text-muted-foreground"> Flux Notifications </span>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="flex items-center gap-1.5 text-[9px] font-black uppercase italic text-primary hover:opacity-70 transition-opacity"
                        >
                            <CheckCheck className="h-3 w-3" />
                            Tout effacer
                        </button>
                    )}
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="m-0 opacity-40" />

                <div className="max-h-80 overflow-y-auto scrollbar-hide">
                    {notifications.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center gap-2 opacity-20">
                            <Inbox className="h-8 w-8 stroke-[1px]" />
                            <span className="text-[10px] font-black uppercase tracking-widest italic">Terminal Vide</span>
                        </div>
                    ) : (
                        notifications.slice(0, 8).map((notification) => (
                            <DropdownMenuItem
                                key={notification._id}
                                className={cn(
                                    "flex flex-col items-start px-4 py-3 cursor-pointer border-b border-border/10 last:border-0 focus:bg-muted/50 transition-colors",
                                    !notification.isRead && "bg-primary/3"
                                )}
                                onClick={() => handleMarkAsRead(notification._id, notification.link)}
                            >
                                <div className="flex justify-between w-full items-start gap-3">
                                    <span className={cn(
                                        "text-[11px] font-black uppercase italic tracking-tighter leading-none",
                                        !notification.isRead ? "text-primary" : "text-muted-foreground/70"
                                    )}>
                                        {notification.title}
                                    </span>
                                    <span className="text-[8px] font-bold uppercase opacity-30 whitespace-nowrap pt-0.5">
                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: false, locale: fr })}
                                    </span>
                                </div>
                                <p className="text-[10px] font-medium text-muted-foreground/60 line-clamp-2 mt-1.5 leading-relaxed">
                                    {notification.message}
                                </p>
                            </DropdownMenuItem>
                        ))
                    )}
                </div>

                <DropdownMenuSeparator className="m-0 opacity-40" />

                <div className="p-2 bg-muted/5">
                    <DropdownMenuItem asChild className="w-full h-10 flex justify-center items-center cursor-pointer rounded-xl focus:bg-primary/10">
                        <Link
                            href="/dashboard/notifications"
                            className="text-[10px] font-black uppercase italic tracking-[0.2em] text-primary/60"
                        >
                            Ouvrir le centre de contrôle
                        </Link>
                    </DropdownMenuItem>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}