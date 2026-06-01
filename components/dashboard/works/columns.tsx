"use client"

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash, Book, Globe, Hash, Calendar, Library, Users } from "lucide-react";
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
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Image from "next/image";

/**
 * getWorkColumns:
 * Colonnes stylisées pour BiblioGest CM.
 * Inclut la gestion des images de couverture et un design "High-Density".
 */
export const getWorkColumns = (
    onEdit: (work: any) => void,
    onDelete: (id: string) => void
): ColumnDef<any>[] => [
        {
            accessorKey: "title",
            header: () => <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Ouvrage</span>,
            cell: ({ row }) => {
                const authors = row.original.authors || [];
                const cover = row.original.coverImage;

                return (
                    <div className="flex items-center gap-4 py-1">
                        {/* COVER PREVIEW */}
                        <div className="relative h-12 w-9 shrink-0 overflow-hidden rounded-md border bg-muted shadow-sm group-hover:shadow-md transition-shadow">
                            {cover ? (
                                <Image
                                    src={cover}
                                    alt={row.original.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-primary/5">
                                    <Book className="h-4 w-4 text-primary/40" />
                                </div>
                            )}
                        </div>

                        {/* TEXT INFO */}
                        <div className="flex flex-col min-w-50">
                            <span className="font-black text-sm uppercase italic tracking-tighter leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                                {row.original.title}
                            </span>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <Users size={10} className="text-muted-foreground/40" />
                                <span className="text-[10px] font-bold text-muted-foreground italic line-clamp-1">
                                    {authors.length > 0
                                        ? authors.map((a: any) => `${a.firstName} ${a.lastName}`).join(", ")
                                        : "Auteur inconnu"}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "isbn",
            header: () => <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Référence</span>,
            cell: ({ row }) => (
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-muted-foreground">
                        <Hash className="h-3 w-3 opacity-40" />
                        {row.getValue("isbn") || "---"}
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-tighter text-primary/60 italic">
                        <Library className="h-2.5 w-2.5" />
                        {row.original.publisher?.name || "N/A"}
                    </div>
                </div>
            )
        },
        {
            accessorKey: "category",
            header: () => <span className="text-[10px] font-black uppercase tracking-widest opacity-50 text-center">Classification</span>,
            cell: ({ row }) => (
                <div className="flex flex-col gap-1.5">
                    <Badge variant="outline" className="w-fit border-primary/20 bg-primary/5 text-[9px] font-black uppercase italic tracking-widest text-primary">
                        {row.original.category?.name || "Non Classé"}
                    </Badge>
                    <div className="flex flex-wrap gap-1">
                        {(row.original.genres || []).slice(0, 2).map((g: any) => (
                            <span key={g._id} className="text-[8px] font-bold uppercase text-muted-foreground/60">
                                # {g.name}
                            </span>
                        ))}
                    </div>
                </div>
            )
        },
        {
            accessorKey: "details",
            header: () => <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Logistique</span>,
            cell: ({ row }) => {
                const date = row.original.publishDate;
                return (
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-tight">
                            <Globe className="h-3 w-3 text-muted-foreground/40" />
                            {row.original.language || "Français"}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/60">
                            <Calendar className="h-3 w-3" />
                            {date ? format(new Date(date), "yyyy", { locale: fr }) : "----"}
                        </div>
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
                            <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-colors rounded-xl border border-transparent hover:border-primary/20">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-2xl border-border/40 p-2 shadow-2xl">
                            <DropdownMenuLabel className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 px-3 py-2">Opérations</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => onEdit(row.original)}
                                className="cursor-pointer rounded-xl font-bold text-xs uppercase italic tracking-tight py-2.5 focus:bg-primary focus:text-primary-foreground"
                            >
                                <Pencil className="mr-2 h-3.5 w-3.5" /> Modifier
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="opacity-40" />
                            <DropdownMenuItem
                                onClick={() => onDelete(row.original._id)}
                                className="text-destructive focus:text-destructive-foreground focus:bg-destructive cursor-pointer rounded-xl font-bold text-xs uppercase italic tracking-tight py-2.5"
                            >
                                <Trash className="mr-2 h-3.5 w-3.5" /> Supprimer
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];
