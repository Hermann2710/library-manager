"use client"

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash, Building2, Globe, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const getPublisherColumns = (
    onEdit: (publisher: any) => void,
    onDelete: (id: string) => void
): ColumnDef<any>[] => [
        {
            accessorKey: "name",
            header: "Éditeur",
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                        <Building2 className="h-5 w-5" />
                    </div>
                    <span className="font-bold">{row.original.name}</span>
                </div>
            ),
        },
        {
            accessorKey: "website",
            header: "Site Web",
            cell: ({ row }) => {
                const url = row.getValue("website") as string;
                return url ? (
                    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center text-primary hover:underline">
                        <Globe className="mr-2 h-4 w-4" />
                        Lien
                    </a>
                ) : <span className="text-muted-foreground">-</span>;
            }
        },
        {
            accessorKey: "email",
            header: "Contact",
            cell: ({ row }) => row.getValue("email") ? (
                <div className="flex items-center text-sm">
                    <Mail className="mr-2 h-3 w-3 text-muted-foreground" />
                    {row.getValue("email")}
                </div>
            ) : "-"
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
                        <DropdownMenuItem onClick={() => onEdit(row.original)}>
                            <Pencil className="mr-2 h-4 w-4" /> Modifier
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onDelete(row.original._id)}
                            className="text-destructive focus:text-destructive"
                        >
                            <Trash className="mr-2 h-4 w-4" /> Supprimer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];