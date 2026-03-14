"use client"

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash, User, CalendarDays, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * Author Columns Definition:
 * Configures how author data is rendered within the TanStack Table.
 * Includes formatting for life dates and identity metadata.
 */
export const getAuthorColumns = (
    onEdit: (author: any) => void,
    onDelete: (id: string) => void
): ColumnDef<any>[] => [
        {
            accessorKey: "fullName",
            header: "Auteur",
            cell: ({ row }) => {
                const { firstName, lastName, nationality } = row.original;
                return (
                    <div className="flex items-center gap-4 py-1">
                        {/* Visual Avatar Placeholder */}
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20 shadow-sm">
                            <User className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="font-black uppercase italic tracking-tighter text-sm truncate">
                                {firstName} {lastName}
                            </span>
                            <div className="flex items-center gap-1.5">
                                <Globe className="h-3 w-3 text-muted-foreground/60" />
                                <span className="text-[10px] font-bold text-muted-foreground/70 uppercase tracking-widest">
                                    {nationality || "Inconnue"}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "birthDate",
            header: "Chronologie",
            cell: ({ row }) => {
                const birth = row.original.birthDate;
                const death = row.original.deathDate;

                /**
                 * Date Lifecycle UI:
                 * Displays a formatted range or a single date if the author is still alive 
                 * or if death data is missing.
                 */
                return (
                    <div className="flex flex-col gap-1">
                        {birth ? (
                            <div className="flex items-center text-[11px] font-bold text-foreground">
                                <span className="bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-md mr-2">★</span>
                                {new Date(birth).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </div>
                        ) : (
                            <span className="text-muted-foreground/40 italic text-[10px]">Date naissance inconnue</span>
                        )}

                        {death && (
                            <div className="flex items-center text-[11px] font-bold text-muted-foreground/60">
                                <span className="bg-rose-500/10 text-rose-600 px-2.2 py-0.5 rounded-md mr-2">†</span>
                                {new Date(death).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: 'numeric' })}
                            </div>
                        )}
                    </div>
                );
            }
        },
        {
            accessorKey: "createdAt",
            header: "Indexé le",
            cell: ({ row }) => (
                <Badge variant="secondary" className="bg-muted/50 text-[9px] font-black uppercase tracking-tighter border-none px-3 py-1">
                    {new Date(row.getValue("createdAt")).toLocaleDateString('fr-FR')}
                </Badge>
            )
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-9 w-9 p-0 rounded-xl hover:bg-muted/80 transition-all border border-transparent hover:border-border/20">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-2xl shadow-xl border-border/40 p-2">
                        <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-3 py-2">Options</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => onEdit(row.original)}
                            className="rounded-lg gap-2 cursor-pointer font-bold text-xs italic py-2.5"
                        >
                            <Pencil className="h-4 w-4 text-primary" /> Modifier la notice
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/40" />
                        <DropdownMenuItem
                            onClick={() => onDelete(row.original._id)}
                            className="rounded-lg gap-2 cursor-pointer font-bold text-xs italic py-2.5 text-rose-600 focus:bg-rose-50 focus:text-rose-700"
                        >
                            <Trash className="h-4 w-4" /> Supprimer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];