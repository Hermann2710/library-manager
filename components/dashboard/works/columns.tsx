"use client"

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash, Book, User, Tags } from "lucide-react";
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

export const getWorkColumns = (
    onEdit: (work: any) => void,
    onDelete: (id: string) => void
): ColumnDef<any>[] => [
        {
            accessorKey: "title",
            header: "Ouvrage",
            cell: ({ row }) => {
                const authors = row.original.authors || [];
                return (
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-8 items-center justify-center rounded bg-muted border shadow-sm">
                            <Book className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold leading-none mb-1">{row.original.title}</span>
                            <span className="text-xs text-muted-foreground italic">
                                {authors.map((a: any) => `${a.firstName} ${a.lastName}`).join(", ")}
                            </span>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "category",
            header: "Catégorie",
            cell: ({ row }) => (
                <Badge variant="outline" className="font-normal">
                    {row.original.category?.name || "N/A"}
                </Badge>
            )
        },
        {
            accessorKey: "publisher",
            header: "Éditeur",
            cell: ({ row }) => (
                <span className="text-sm font-medium text-muted-foreground">
                    {row.original.publisher?.name || "-"}
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