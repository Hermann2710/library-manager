"use client"

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash, MapPin, AlignLeft } from "lucide-react";
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
 * Location Columns Definition:
 * Configures the logistics table to display physical zones and storage metadata.
 * Used within the TanStack Table component for the administrative dashboard.
 */
export const getLocationColumns = (
    onEdit: (location: any) => void,
    onDelete: (id: string) => void
): ColumnDef<any>[] => [
        {
            accessorKey: "name",
            header: "Zone de Stockage",
            cell: ({ row }) => (
                <div className="flex items-center gap-4 py-1">
                    {/* Visual Location Icon Container */}
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/5 border border-primary/10 text-primary">
                        <MapPin className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-black uppercase italic tracking-tighter text-[13px] leading-tight">
                            {row.getValue("name")}
                        </span>
                        <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] mt-0.5">
                            Identifiant Logistique
                        </span>
                    </div>
                </div>
            )
        },
        {
            accessorKey: "description",
            header: "Spécifications",
            cell: ({ row }) => {
                const description = row.getValue("description") as string;
                return (
                    <div className="flex items-start gap-2 max-w-75">
                        <AlignLeft className="h-3 w-3 mt-1 text-muted-foreground/40 shrink-0" />
                        <span className="text-[11px] font-medium text-muted-foreground italic leading-relaxed line-clamp-2">
                            {description || "Aucune note technique enregistrée pour cette zone."}
                        </span>
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
                        <DropdownMenuContent align="end" className="w-52 rounded-2xl shadow-xl border-border/40 p-2">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-3 py-2">
                                Gestion Zone
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => onEdit(row.original)}
                                className="rounded-lg gap-2 cursor-pointer font-bold text-xs italic py-2.5"
                            >
                                <Pencil className="h-4 w-4 text-primary" /> Modifier les accès
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-2 bg-border/40" />
                            <DropdownMenuItem
                                onClick={() => onDelete(row.original._id)}
                                className="rounded-lg gap-2 cursor-pointer font-bold text-xs italic py-2.5 text-rose-600 focus:bg-rose-50 focus:text-rose-700"
                            >
                                <Trash className="h-4 w-4" /> Supprimer du plan
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];