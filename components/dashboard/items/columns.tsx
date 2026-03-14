"use client"

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash, Barcode as BarcodeIcon, MapPin, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
 * Status UI Configuration:
 * Maps database status strings to specialized visual variants.
 */
const statusStyles: any = {
    Available: {
        label: "Disponible",
        className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-sm shadow-emerald-500/5"
    },
    Borrowed: {
        label: "En prêt",
        className: "bg-blue-500/10 text-blue-600 border-blue-500/20"
    },
    Maintenance: {
        label: "Maintenance",
        className: "bg-amber-500/10 text-amber-600 border-amber-500/20 animate-pulse"
    },
    Lost: {
        label: "Perdu",
        className: "bg-rose-500/10 text-rose-600 border-rose-500/20"
    },
};

/**
 * Condition UI Mapping:
 * Maps physical state to descriptive labels and tones.
 */
const conditionStyles: any = {
    New: { label: "Neuf", color: "text-emerald-600" },
    Good: { label: "Bon état", color: "text-foreground" },
    Worn: { label: "Usé", color: "text-amber-600" },
    Damaged: { label: "Abîmé", color: "text-rose-600" },
};

export const getItemColumns = (
    onEdit: (item: any) => void,
    onDelete: (id: string) => void
): ColumnDef<any>[] => [
        {
            accessorKey: "barcode",
            header: "Identifiant",
            cell: ({ row }) => (
                <div className="flex items-center gap-3 bg-muted/30 px-3 py-1.5 rounded-xl border border-border/40 w-fit">
                    <BarcodeIcon className="h-3.5 w-3.5 text-muted-foreground/60" />
                    <span className="font-mono text-[11px] font-black tracking-wider uppercase">
                        {row.getValue("barcode")}
                    </span>
                </div>
            )
        },
        {
            accessorKey: "work.title",
            header: "Ouvrage & Auteur",
            cell: ({ row }) => {
                const work = row.original.work;
                return (
                    <div className="flex flex-col max-w-62.5 min-w-0">
                        <span className="font-black text-[13px] uppercase italic tracking-tighter truncate leading-tight">
                            {work?.title || "Titre inconnu"}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground truncate uppercase tracking-widest mt-0.5 opacity-70">
                            {work?.authors?.map((a: any) => `${a.firstName} ${a.lastName}`).join(", ") || "Auteur anonyme"}
                        </span>
                    </div>
                );
            }
        },
        {
            accessorKey: "status",
            header: "Disponibilité",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                const style = statusStyles[status] || { label: status, className: "" };
                return (
                    <Badge className={cn(
                        "font-black text-[9px] uppercase tracking-[0.2em] px-3 py-1 rounded-full border shadow-none",
                        style.className
                    )}>
                        {style.label}
                    </Badge>
                );
            }
        },
        {
            accessorKey: "location",
            header: "Localisation",
            cell: ({ row }) => (
                <div className="flex items-center gap-2 text-[11px] font-bold text-muted-foreground/80">
                    <div className="p-1.5 bg-muted rounded-lg">
                        <MapPin className="h-3 w-3" />
                    </div>
                    <span className="uppercase tracking-tight">
                        {row.original.location?.name || "Non assigné"}
                    </span>
                </div>
            )
        },
        {
            accessorKey: "condition",
            header: "État",
            cell: ({ row }) => {
                const condition = row.getValue("condition") as string;
                const style = conditionStyles[condition] || { label: condition, color: "" };
                return (
                    <div className="flex items-center gap-2">
                        <Activity className={cn("h-3 w-3 opacity-30", style.color)} />
                        <span className={cn("text-[10px] font-black uppercase tracking-widest italic", style.color)}>
                            {style.label}
                        </span>
                    </div>
                );
            }
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-muted/80 border border-transparent hover:border-border/20 transition-all">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-52 rounded-2xl shadow-xl border-border/40 p-2">
                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-3 py-2">
                            Inventaire
                        </DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => onEdit(row.original)}
                            className="rounded-lg gap-2 cursor-pointer font-bold text-xs italic py-2.5"
                        >
                            <Pencil className="h-4 w-4 text-primary" /> Éditer l'unité
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-2 bg-border/40" />
                        <DropdownMenuItem
                            onClick={() => onDelete(row.original._id)}
                            className="rounded-lg gap-2 cursor-pointer font-bold text-xs italic py-2.5 text-rose-600 focus:bg-rose-50 focus:text-rose-700"
                        >
                            <Trash className="h-4 w-4" /> Retirer du stock
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];