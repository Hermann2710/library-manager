"use client"

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MoreHorizontal, Pencil, User as UserIcon, ShieldAlert, CalendarClock, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/**
 * Member Columns Definition:
 * Manages the presentation of library users.
 * Features automated status styling and membership expiration warnings.
 */
export const getMemberColumns = (onEdit: (member: any) => void): ColumnDef<any>[] => [
    {
        accessorKey: "memberId",
        header: "Identifiant",
        cell: ({ row }) => (
            <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-xl border border-border/40 w-fit">
                <Hash className="h-3 w-3 text-muted-foreground/50" />
                <span className="font-mono text-[11px] font-black tracking-widest uppercase">
                    {row.getValue("memberId")}
                </span>
            </div>
        )
    },
    {
        accessorKey: "user.name",
        header: "Membre",
        cell: ({ row }) => (
            <div className="flex items-center gap-4 py-1">
                <div className="h-10 w-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 shadow-sm">
                    <UserIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="font-black uppercase italic tracking-tighter text-[13px] leading-tight truncate">
                        {row.original.user?.name}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground truncate uppercase tracking-widest mt-0.5 opacity-70">
                        {row.original.user?.email}
                    </span>
                </div>
            </div>
        )
    },
    {
        accessorKey: "phone",
        header: "Contact",
        cell: ({ row }) => (
            <span className="text-[11px] font-mono font-bold tracking-tighter text-muted-foreground">
                {row.getValue("phone") || "N/A"}
            </span>
        )
    },
    {
        accessorKey: "status",
        header: "État du compte",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            const config: any = {
                Active: { label: "Actif", class: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
                Inactive: { label: "Inactif", class: "bg-slate-100 text-slate-500 border-slate-200" },
                Banned: { label: "Banni", class: "bg-rose-500/10 text-rose-600 border-rose-500/20 animate-pulse" }
            };
            const current = config[status] || { label: status, class: "" };

            return (
                <Badge className={cn(
                    "font-black text-[9px] uppercase tracking-[0.2em] px-3 py-1 rounded-full border shadow-none",
                    current.class
                )}>
                    {current.label}
                </Badge>
            );
        }
    },
    {
        accessorKey: "membershipExpiresAt",
        header: "Expiration",
        cell: ({ row }) => {
            const expiry = row.getValue("membershipExpiresAt");
            if (!expiry) return <span className="text-[10px] italic text-muted-foreground opacity-40">Illimitée</span>;

            const date = new Date(expiry as string);
            const isExpired = date < new Date();

            return (
                <div className={cn(
                    "flex items-center gap-2 text-[11px] font-black italic uppercase tracking-tighter",
                    isExpired ? "text-rose-600" : "text-muted-foreground"
                )}>
                    <CalendarClock className={cn("h-3.5 w-3.5", isExpired && "animate-bounce")} />
                    <span>
                        {format(date, "dd MMM yyyy", { locale: fr })}
                    </span>
                    {isExpired && <ShieldAlert className="h-3 w-3" />}
                </div>
            );
        }
    },
    {
        id: "actions",
        cell: ({ row }) => (
            <div className="flex justify-end">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-muted border border-transparent hover:border-border/20 transition-all">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-xl border-border/40 p-2">
                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-3 py-2">
                            Administration Membre
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-border/40" />
                        <DropdownMenuItem
                            onClick={() => onEdit(row.original)}
                            className="rounded-lg gap-2 cursor-pointer font-bold text-xs italic py-2.5"
                        >
                            <Pencil className="h-4 w-4 text-primary" /> Modifier la fiche profil
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        ),
    },
];