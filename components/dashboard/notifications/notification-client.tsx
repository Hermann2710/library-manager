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
    ArrowRight,
    Bell
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
import { cn } from "@/lib/utils";

/**
 * NotificationsClient Component.
 * Handles real-time filtering, searching, and status updates for notifications.
 * Designed with a compact dashboard aesthetic for BiblioGest CM.
 */
export function NotificationsClient({ initialNotifications, userId, userRole }: any) {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterType, setFilterType] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    /**
     * useMemo Filtering:
     * We compute the visible notifications based on status, type, and search query.
     * This avoids expensive recalculations on every single render.
     */
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

    /**
     * handleMarkRead:
     * Optimistically updates the UI while the Server Action persists the 
     * change in the database.
     */
    const handleMarkRead = async (id: string) => {
        // Trigger server-side update
        await markAsRead(id);

        // Reflect change locally for instant feedback
        setNotifications(notifications.map((n: any) =>
            n._id === id ? { ...n, isRead: true } : n
        ));
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* SEARCH & FILTER BAR */}
            <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center bg-card/50 backdrop-blur-sm p-2 rounded-[2rem] border border-border/40 shadow-sm">
                <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                    <Tabs value={filterStatus} onValueChange={setFilterStatus} className="bg-muted/30 p-1 rounded-2xl border border-border/50">
                        <TabsList className="bg-transparent h-9 gap-1">
                            <TabsTrigger value="all" className="text-[10px] font-black uppercase tracking-widest px-5 rounded-xl">Toutes</TabsTrigger>
                            <TabsTrigger value="unread" className="text-[10px] font-black uppercase tracking-widest px-5 rounded-xl">Non lues</TabsTrigger>
                            <TabsTrigger value="read" className="text-[10px] font-black uppercase tracking-widest px-5 rounded-xl">Lues</TabsTrigger>
                        </TabsList>
                    </Tabs>

                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-full sm:w-44 h-11 rounded-2xl bg-muted/30 border-none font-black text-[10px] uppercase tracking-widest">
                            <div className="flex items-center gap-2 italic">
                                <Filter className="h-3.5 w-3.5 text-primary" />
                                <SelectValue placeholder="Type" />
                            </div>
                        </SelectTrigger>
                        <SelectContent position="popper" sideOffset={8} className="rounded-2xl border-border/40 shadow-xl">
                            <SelectItem value="all" className="text-xs font-bold uppercase italic">Tous les types</SelectItem>
                            <SelectItem value="system" className="text-xs font-bold uppercase italic text-blue-500">Système</SelectItem>
                            <SelectItem value="inventory" className="text-xs font-bold uppercase italic text-amber-500">Inventaire</SelectItem>
                            <SelectItem value="loan" className="text-xs font-bold uppercase italic text-emerald-500">Prêts / Retours</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="relative w-full lg:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                    <Input
                        placeholder="Rechercher une alerte..."
                        className="pl-11 h-11 bg-muted/30 border-none rounded-2xl font-bold text-sm focus-visible:ring-1 focus-visible:ring-primary/20 transition-all shadow-inner"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* NOTIFICATIONS LIST */}
            <div className="grid gap-4">
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((n: any) => (
                        <div
                            key={n._id}
                            className={cn(
                                "group relative flex items-start gap-5 p-6 rounded-[2rem] border transition-all duration-500",
                                !n.isRead
                                    ? "bg-primary/3 border-primary/20 shadow-md shadow-primary/5"
                                    : "bg-card border-border/40 hover:border-border/80"
                            )}
                        >
                            {/* Read/Unread Indicator */}
                            <div className="mt-1.5 shrink-0">
                                {!n.isRead ? (
                                    <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_12px_rgba(var(--primary),0.5)] animate-pulse" />
                                ) : (
                                    <div className="p-1.5 rounded-lg bg-muted/50">
                                        <CheckCheck className="h-3.5 w-3.5 text-muted-foreground/60" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 space-y-3">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h4 className="font-black text-sm md:text-base uppercase italic tracking-tight">
                                            {n.title}
                                        </h4>
                                        <Badge variant="outline" className="text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-0.5 rounded-full border-primary/20 bg-primary/5 text-primary/70">
                                            {n.type}
                                        </Badge>
                                    </div>
                                    <span className="text-[10px] font-black uppercase text-muted-foreground/50 flex items-center gap-2 bg-muted/10 px-3 py-1 rounded-full border border-border/20">
                                        <CalendarIcon className="h-3 w-3" />
                                        {format(new Date(n.createdAt), "dd MMM yyyy 'à' HH:mm", { locale: fr })}
                                    </span>
                                </div>

                                <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-4xl">
                                    {n.message}
                                </p>

                                <div className="flex flex-wrap items-center gap-4 pt-2">
                                    {n.link && (
                                        <Button variant="link" size="sm" className="p-0 h-auto text-primary text-[10px] font-black uppercase tracking-widest italic group-hover:translate-x-1 transition-transform" asChild>
                                            <Link href={n.link} className="flex items-center gap-1.5">
                                                Accéder à l'ouvrage <ArrowRight className="h-3.5 w-3.5" />
                                            </Link>
                                        </Button>
                                    )}
                                    {!n.isRead && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-auto py-1.5 px-4 text-[9px] font-black uppercase tracking-widest rounded-full hover:bg-primary/10 hover:text-primary transition-all border border-transparent hover:border-primary/20"
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
                    /* EMPTY STATE */
                    <div className="flex flex-col items-center justify-center py-32 bg-muted/10 rounded-[3rem] border border-dashed border-border/60 animate-in zoom-in-95 duration-700">
                        <div className="relative mb-6">
                            <Inbox className="h-16 w-16 text-muted-foreground/10" />
                            <Bell className="h-6 w-6 text-muted-foreground/20 absolute -top-1 -right-1 rotate-12" />
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground">Aucune alerte trouvée</h3>
                        <p className="text-xs text-muted-foreground/50 italic mt-1 font-medium">Votre boîte de réception est vide pour ces filtres.</p>
                        <Button
                            variant="link"
                            onClick={() => { setFilterStatus("all"); setFilterType("all"); setSearchQuery("") }}
                            className="mt-6 text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary"
                        >
                            Réinitialiser les filtres
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
