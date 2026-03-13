"use client"

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash, Book, Globe, Hash, Calendar } from "lucide-react";
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
                        <div className="flex h-10 w-8 items-center justify-center rounded bg-muted border shadow-sm shrink-0">
                            <Book className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex flex-col min-w-37.5">
                            <span className="font-bold leading-none mb-1 line-clamp-1">{row.original.title}</span>
                            <span className="text-xs text-muted-foreground italic line-clamp-1">
                                {authors.map((a: any) => `${a.firstName} ${a.lastName}`).join(", ")}
                            </span>
                        </div>
                    </div>
                );
            },
        },
        {
            accessorKey: "isbn",
            header: "ISBN",
            cell: ({ row }) => (
                <div className="flex items-center gap-1 text-xs font-mono text-muted-foreground">
                    <Hash className="h-3 w-3" />
                    {row.getValue("isbn") || "N/A"}
                </div>
            )
        },
        {
            accessorKey: "category",
            header: "Catégorie",
            cell: ({ row }) => (
                <Badge variant="secondary" className="font-normal whitespace-nowrap">
                    {row.original.category?.name || "N/A"}
                </Badge>
            )
        },
        {
            accessorKey: "genres",
            header: "Genres",
            cell: ({ row }) => {
                const genres = row.original.genres || [];
                return (
                    <div className="flex flex-wrap gap-1 max-w-50">
                        {genres.slice(0, 2).map((g: any) => (
                            <Badge key={g._id} variant="outline" className="text-[10px] px-1 py-0">
                                {g.name}
                            </Badge>
                        ))}
                        {genres.length > 2 && (
                            <span className="text-[10px] text-muted-foreground">+{genres.length - 2}</span>
                        )}
                    </div>
                );
            }
        },
        {
            accessorKey: "language",
            header: "Langue",
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5 text-sm">
                    <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                    {row.getValue("language")}
                </div>
            )
        },
        {
            accessorKey: "publishDate",
            header: "Publication",
            cell: ({ row }) => {
                const date = row.getValue("publishDate");
                return (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        {date ? format(new Date(date as string), "yyyy", { locale: fr }) : "-"}
                    </div>
                );
            }
        },
        {
            accessorKey: "publisher",
            header: "Éditeur",
            cell: ({ row }) => (
                <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
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