"use client"

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, ShieldCheck, UserCog, Trash2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateUserRole } from "@/actions/user-actions";
import { toast } from "sonner";

export const getUserColumns = (onDelete: (id: string) => void): ColumnDef<any>[] => [
    {
        accessorKey: "name",
        header: "Utilisateur",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium">{row.original.name}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {row.original.email}
                </span>
            </div>
        )
    },
    {
        accessorKey: "role",
        header: "Rôle",
        cell: ({ row }) => {
            const role = row.getValue("role") as string;
            const config = {
                admin: { label: "Administrateur", color: "bg-rose-500 hover:bg-rose-600" },
                librarian: { label: "Bibliothécaire", color: "bg-blue-500 hover:bg-blue-600" },
                reader: { label: "Lecteur", color: "bg-slate-500 hover:bg-slate-600" },
            }[role] || { label: role, color: "bg-gray-500" };

            return <Badge className={`${config.color} text-white border-none`}>{config.label}</Badge>;
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const user = row.original;

            const changeRole = async (newRole: string) => {
                try {
                    await updateUserRole(user._id, newRole);
                    toast.success(`Rôle mis à jour : ${newRole}`);
                } catch (err: any) {
                    toast.error(err.message);
                }
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuLabel>Modifier le rôle</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => changeRole("admin")}>
                            <ShieldCheck className="mr-2 h-4 w-4 text-rose-500" /> Promouvoir Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeRole("librarian")}>
                            <UserCog className="mr-2 h-4 w-4 text-blue-500" /> Passer Bibliothécaire
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => changeRole("reader")}>
                            <UserCog className="mr-2 h-4 w-4 text-slate-500" /> Passer Lecteur
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => onDelete(user._id)}
                            className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                        >
                            <Trash2 className="mr-2 h-4 w-4" /> Supprimer le compte
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];