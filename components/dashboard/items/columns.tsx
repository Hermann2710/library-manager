"use client"

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash, Barcode as BarcodeIcon, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusStyles: any = {
    Available: { label: "Disponible", variant: "success", className: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" },
    Borrowed: { label: "Emprunté", variant: "secondary", className: "" },
    Maintenance: { label: "Maintenance", variant: "warning", className: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" },
    Lost: { label: "Perdu", variant: "destructive", className: "" },
};

export const getItemColumns = (
    onEdit: (item: any) => void,
    onDelete: (id: string) => void
): ColumnDef<any>[] => [
        {
            accessorKey: "barcode",
            header: "Code-barres",
            cell: ({ row }) => (
                <div className="flex items-center gap-2 font-mono text-sm font-bold">
                    <BarcodeIcon className="h-4 w-4 text-muted-foreground" />
                    {row.getValue("barcode")}
                </div>
            )
        },
        {
            accessorKey: "work.title",
            header: "Ouvrage",
            cell: ({ row }) => (
                <div className="flex flex-col">
                    <span className="font-medium">{row.original.work?.title}</span>
                    <span className="text-xs text-muted-foreground italic">
                        {row.original.work?.authors?.map((a: any) => `${a.firstName} ${a.lastName}`).join(", ")}
                    </span>
                </div>
            )
        },
        {
            accessorKey: "status",
            header: "Statut",
            cell: ({ row }) => {
                const status = row.getValue("status") as string;
                const style = statusStyles[status] || { label: status, variant: "outline" };
                return (
                    <Badge variant={style.variant} className={style.className}>
                        {style.label}
                    </Badge>
                );
            }
        },
        {
            accessorKey: "location",
            header: "Emplacement",
            cell: ({ row }) => (
                <div className="flex items-center gap-1.5 text-sm">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    {row.original.location?.name || "Non assigné"}
                </div>
            )
        },
        {
            accessorKey: "condition",
            header: "État",
            cell: ({ row }) => {
                const condition = row.getValue("condition") as string;
                return <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{condition}</span>;
            }
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
                        <DropdownMenuItem onClick={() => onDelete(row.original._id)} className="text-destructive cursor-pointer">
                            <Trash className="mr-2 h-4 w-4" /> Supprimer
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];