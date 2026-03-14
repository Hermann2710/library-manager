"use client"

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash, Building2, Globe, Mail, ExternalLink } from "lucide-react";
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
 * Publisher Columns Configuration:
 * Defines the administrative view for publishing partners.
 * Features quick-access links to corporate websites and direct email contacts.
 */
export const getPublisherColumns = (
    onEdit: (publisher: any) => void,
    onDelete: (id: string) => void
): ColumnDef<any>[] => [
        {
            accessorKey: "name",
            header: "Maison d'Édition",
            cell: ({ row }) => (
                <div className="flex items-center gap-4 py-1">
                    {/* Visual Identity Block */}
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/5 border border-primary/10 text-primary shadow-sm">
                        <Building2 className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-black uppercase italic tracking-tighter text-[13px] leading-tight truncate">
                            {row.original.name}
                        </span>
                        <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-[0.2em] mt-0.5">
                            Partenaire Officiel
                        </span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "website",
            header: "Plateforme",
            cell: ({ row }) => {
                const url = row.getValue("website") as string;
                return url ? (
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest italic hover:bg-primary hover:text-white transition-all duration-300"
                    >
                        <Globe className="h-3.5 w-3.5" />
                        Visiter
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                ) : (
                    <span className="text-[10px] font-bold text-muted-foreground/30 uppercase italic px-3">Non répertorié</span>
                );
            }
        },
        {
            accessorKey: "email",
            header: "Contact Logistique",
            cell: ({ row }) => {
                const email = row.getValue("email") as string;
                return email ? (
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-muted rounded-lg border border-border/40">
                            <Mail className="h-3 w-3 text-muted-foreground/60" />
                        </div>
                        <span className="text-[11px] font-mono font-bold tracking-tighter text-muted-foreground truncate max-w-37.5">
                            {email}
                        </span>
                    </div>
                ) : <span className="text-muted-foreground/30 px-2">-</span>;
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
                                Gestion Éditeur
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-border/40" />
                            <DropdownMenuItem
                                onClick={() => onEdit(row.original)}
                                className="rounded-lg gap-2 cursor-pointer font-bold text-xs italic py-2.5"
                            >
                                <Pencil className="h-4 w-4 text-primary" /> Modifier les informations
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-2 bg-border/40" />
                            <DropdownMenuItem
                                onClick={() => onDelete(row.original._id)}
                                className="rounded-lg gap-2 cursor-pointer font-bold text-xs italic py-2.5 text-rose-600 focus:bg-rose-50 focus:text-rose-700"
                            >
                                <Trash className="h-4 w-4" /> Retirer du registre
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
        },
    ];