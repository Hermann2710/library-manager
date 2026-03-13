"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
    CheckCheck,
    Inbox,
    Search,
    Filter,
    Calendar as CalendarIcon,
    ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { markAsRead } from "@/actions/notification-actions";

export function NotificationsClient({ initialNotifications, userId, userRole }: any) {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [filterStatus, setFilterStatus] = useState("all"); // all, unread, read
    const [filterType, setFilterType] = useState("all"); // all, system, inventory, loan
    const [searchQuery, setSearchQuery] = useState("");

    // Logique de filtrage combinée
    const filteredNotifications = useMemo(() => {
        return notifications.filter((n: any) => {
            const matchesStatus =
                filterStatus === "all" ? true :
                    filterStatus === "unread" ? !n.isRead : n.isRead;

            const matchesType =
                filterType === "all" ? true : n.type === filterType;

            const matchesSearch =
                n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                n.message.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesStatus && matchesType && matchesSearch;
        });
    }, [notifications, filterStatus, filterType, searchQuery]);

    const handleMarkRead = async (id: string) => {
        await markAsRead(id);
        setNotifications(notifications.map((n: any) =>
            n._id === id ? { ...n, isRead: true } : n
        ));
    };

    return (
        <div className="space-y-6">
            {/* BARRE DE FILTRES */}
            <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-card p-4 rounded-xl border">
                <div className="flex flex-wrap items-center gap-3">
                    <Tabs value={filterStatus} onValueChange={setFilterStatus} className="w-fit">
                        <TabsList>
                            <TabsTrigger value="all">Toutes</TabsTrigger>
                            <TabsTrigger value="unread">Non lues</TabsTrigger>
                            <TabsTrigger value="read">Lues</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-40">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        {/* AJOUTE position="popper" ET sideOffset ICI */}
                        <SelectContent position="popper" sideOffset={5} className="w-40">
                            <SelectItem value="all">Tous les types</SelectItem>
                            <SelectItem value="system">Système</SelectItem>
                            <SelectItem value="inventory">Inventaire</SelectItem>
                            <SelectItem value="loan">Prêts / Retours</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* LISTE DES NOTIFICATIONS */}
            <div className="grid gap-3">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((n: any) => (
                        <div
                            key={n._id}
                            className={`group relative flex items-start gap-4 p-4 rounded-xl border transition-all hover:shadow-md ${!n.isRead ? "bg-primary/5 border-primary/20" : "bg-card"
                                }`}
                        >
                            <div className="mt-1">
                                {!n.isRead ? (
                                    <div className="h-3 w-3 rounded-full bg-primary animate-pulse" />
                                ) : (
                                    <CheckCheck className="h-4 w-4 text-muted-foreground" />
                                )}
                            </div>

                            <div className="flex-1 space-y-1">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-sm md:text-base">{n.title}</span>
                                        <Badge variant="outline" className="text-[10px] uppercase">
                                            {n.type}
                                        </Badge>
                                    </div>
                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                        <CalendarIcon className="h-3 w-3" />
                                        {format(new Date(n.createdAt), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {n.message}
                                </p>

                                <div className="flex items-center gap-4 mt-3">
                                    {n.link && (
                                        <Button variant="link" size="sm" className="p-0 h-auto text-primary" asChild>
                                            <Link href={n.link} className="flex items-center gap-1">
                                                Accéder à la page <ArrowRight className="h-3 w-3" />
                                            </Link>
                                        </Button>
                                    )}
                                    {!n.isRead && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-auto py-1 px-2 text-xs"
                                            onClick={() => handleMarkRead(n._id)}
                                        >
                                            Marquer comme lu
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                        <Inbox className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <h3 className="text-lg font-medium">Aucune notification trouvée</h3>
                        <p className="text-muted-foreground">Essayez de modifier vos filtres de recherche.</p>
                    </div>
                )}
            </div>
        </div>
    );
}