"use client"

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash, User, CalendarDays } from "lucide-react";
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

export const getAuthorColumns = (
    onEdit: (author: any) => void,
    onDelete: (id: string) => void
): ColumnDef<any>[] => [
        {
            accessorKey: "fullName",
            header: "Auteur",
            cell: ({ row }) => {
                const { firstName, lastName } = row.original;
                return (
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                            <User className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold">{firstName} {lastName}</span>
                            <span className="text-xs text-muted-foreground uppercase">{row.original.nationality || "Inconnue"}</span>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "birthDate",
            header: "Naissance",
            cell: ({ row }) => {
                const date = row.getValue("birthDate");
                return date ? (
                    <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarDays className="mr-2 h-3 w-3" />
                        {new Date(date as string).toLocaleDateString('fr-FR')}
                    </div>
                ) : <span className="text-muted-foreground italic">-</span>;
            }
        },
        {
            accessorKey: "deathDate",
            header: "Décès",
            cell: ({ row }) => {
                const date = row.getValue("deathDate");
                return date ? (
                    <div className="flex items-center text-sm text-destructive/80">
                        <CalendarDays className="mr-2 h-3 w-3" />
                        {new Date(date as string).toLocaleDateString('fr-FR')}
                    </div>
                ) : <span className="text-muted-foreground italic">-</span>;
            }
        },
        {
            accessorKey: "createdAt",
            header: "Enregistré le",
            cell: ({ row }) => (
                <span className="text-xs font-medium">
                    {new Date(row.getValue("createdAt")).toLocaleDateString('fr-FR')}
                </span>
            )
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(row.original)} className="cursor-pointer">
                            <Pencil className="mr-2 h-4 w-4" /> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onDelete(row.original._id)}
                            className="text-destructive focus:text-destructive cursor-pointer"
                        >
                            <Trash className="mr-2 h-4 w-4" /> Supprimer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];