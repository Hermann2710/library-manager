"use client"

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { MoreHorizontal, Pencil, User as UserIcon, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const getMemberColumns = (onEdit: (member: any) => void): ColumnDef<any>[] => [
    {
        accessorKey: "memberId",
        header: "ID",
        cell: ({ row }) => <span className="font-mono text-xs bg-muted p-1 rounded">{row.getValue("memberId")}</span>
    },
    {
        accessorKey: "user.name",
        header: "Nom / Email",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex flex-col">
                    <span className="font-medium leading-none">{row.original.user?.name}</span>
                    <span className="text-xs text-muted-foreground mt-1">{row.original.user?.email}</span>
                </div>
            </div>
        )
    },
    {
        accessorKey: "phone",
        header: "Téléphone",
    },
    {
        accessorKey: "status",
        header: "Statut",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <Badge
                    variant={status === "Active" ? "outline" : "destructive"}
                    className={status === "Active" ? "border-green-500 text-green-600" : ""}
                >
                    {status === "Active" ? "Actif" : status === "Inactive" ? "Inactif" : "Banni"}
                </Badge>
            );
        }
    },
    {
        accessorKey: "membershipExpiresAt",
        header: "Fin d'adhésion",
        cell: ({ row }) => {
            const date = new Date(row.getValue("membershipExpiresAt"));
            const isExpired = date < new Date();
            return (
                <div className="flex items-center gap-2">
                    <span className={`text-sm ${isExpired ? "text-destructive font-bold" : ""}`}>
                        {format(date, "dd MMM yyyy", { locale: fr })}
                    </span>
                    {isExpired && <ShieldAlert className="h-3 w-3 text-destructive" />}
                </div>
            );
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
                        <Pencil className="mr-2 h-4 w-4" /> Modifier la fiche
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];