"use client"

import { useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
    MoreHorizontal,
    ShieldCheck,
    UserCog,
    Trash2,
    Mail,
    ShieldAlert,
    Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { updateUserRole } from "@/actions/user-actions";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/**
 * ActionCell Component:
 * Encapsulates the logic for role updates and account deletion 
 * with dedicated confirmation dialogs for each action.
 */
const ActionCell = ({ user, onDelete }: { user: any, onDelete: (id: string) => void }) => {
    const [openRoleDialog, setOpenRoleDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [pendingRole, setPendingRole] = useState<string | null>(null);

    const handleRoleChange = async () => {
        if (!pendingRole) return;
        try {
            await updateUserRole(user._id, pendingRole);
            toast.success(`Security clearance updated: ${pendingRole.toUpperCase()}`);
        } catch (err: any) {
            toast.error(err.message || "Failed to update role");
        } finally {
            setOpenRoleDialog(false);
            setPendingRole(null);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-10 w-10 p-0 rounded-xl hover:bg-muted/80 border border-transparent hover:border-border/40 transition-all">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-xl border-border/40">
                    <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground px-3 py-2">
                        Autorisations
                    </DropdownMenuLabel>

                    <DropdownMenuItem onClick={() => { setPendingRole("admin"); setOpenRoleDialog(true); }} className="rounded-lg gap-2 cursor-pointer font-bold text-xs italic py-2.5">
                        <ShieldCheck className="h-4 w-4 text-rose-500" /> Promouvoir Admin
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => { setPendingRole("librarian"); setOpenRoleDialog(true); }} className="rounded-lg gap-2 cursor-pointer font-bold text-xs italic py-2.5">
                        <UserCog className="h-4 w-4 text-blue-500" /> Staff : Bibliothécaire
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => { setPendingRole("reader"); setOpenRoleDialog(true); }} className="rounded-lg gap-2 cursor-pointer font-bold text-xs italic py-2.5">
                        <UserCog className="h-4 w-4 text-slate-500" /> Passer Lecteur
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-2 bg-border/40" />

                    <DropdownMenuItem
                        onClick={() => setOpenDeleteDialog(true)}
                        className="rounded-lg gap-2 cursor-pointer font-bold text-xs italic py-2.5 text-rose-600 focus:bg-rose-50 focus:text-rose-700"
                    >
                        <Trash2 className="h-4 w-4" /> Révoquer l'accès
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* ROLE CHANGE CONFIRMATION */}
            <AlertDialog open={openRoleDialog} onOpenChange={setOpenRoleDialog}>
                <AlertDialogContent className="rounded-[2.5rem] border-border/40 shadow-2xl">
                    <AlertDialogHeader className="items-center text-center space-y-4">
                        <div className="bg-primary/10 p-4 rounded-full border border-primary/20">
                            <ShieldCheck className="h-8 w-8 text-primary" />
                        </div>
                        <AlertDialogTitle className="font-black uppercase italic tracking-tighter text-xl">
                            Modifier les permissions ?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm font-medium leading-relaxed">
                            Vous êtes sur le point de passer <strong>{user.name}</strong> au rang de <span className="font-black text-primary">{pendingRole?.toUpperCase()}</span>.
                            Cela modifiera ses accès aux fonctionnalités sensibles.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-8 sm:flex-row gap-2">
                        <AlertDialogCancel className="flex-1 rounded-2xl font-black uppercase text-[10px] tracking-widest h-12">Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleRoleChange} className="flex-1 bg-primary rounded-2xl font-black uppercase text-[10px] tracking-widest h-12">
                            Confirmer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* DELETE ACCOUNT CONFIRMATION */}
            <AlertDialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
                <AlertDialogContent className="rounded-[2.5rem] border-rose-500/20 bg-rose-50/10 shadow-2xl backdrop-blur-md">
                    <AlertDialogHeader className="items-center text-center space-y-4">
                        <div className="bg-rose-500/10 p-4 rounded-full border border-rose-500/20">
                            <ShieldAlert className="h-8 w-8 text-rose-600" />
                        </div>
                        <AlertDialogTitle className="font-black uppercase italic tracking-tighter text-xl text-rose-600">
                            Révoquer l'accès définitif ?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm font-medium text-rose-900/70 leading-relaxed px-4">
                            Cette action supprimera le profil de <strong>{user.name}</strong>. Toute activité en cours sera interrompue et l'utilisateur ne pourra plus se connecter.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="mt-8 sm:flex-row gap-3">
                        <AlertDialogCancel className="flex-1 rounded-2xl font-black uppercase text-[10px] tracking-widest h-12 border-rose-500/20">Conserver</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => onDelete(user._id)}
                            className="flex-1 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest h-12 shadow-lg shadow-rose-500/20"
                        >
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export const getUserColumns = (onDelete: (id: string) => void): ColumnDef<any>[] => [
    {
        accessorKey: "name",
        header: "Utilisateur",
        cell: ({ row }) => (
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-muted/40 border border-border/10 flex items-center justify-center font-black text-[10px] text-muted-foreground uppercase">
                    {row.original.name.substring(0, 2)}
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="font-black text-sm uppercase italic tracking-tight truncate">{row.original.name}</span>
                    <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1.5 lowercase">
                        <Mail className="h-3 w-3 opacity-50" /> {row.original.email}
                    </span>
                </div>
            </div>
        )
    },
    {
        accessorKey: "role",
        header: "Rôle",
        cell: ({ row }) => {
            const role = row.getValue("role") as string;
            const config = {
                admin: { label: "Admin", color: "text-rose-600 bg-rose-50 border-rose-200" },
                librarian: { label: "Staff", color: "text-blue-600 bg-blue-50 border-blue-200" },
                reader: { label: "Membre", color: "text-slate-600 bg-slate-50 border-slate-200" },
            }[role] || { label: role, color: "text-gray-500 bg-gray-50 border-gray-200" };

            return (
                <Badge className={cn(
                    "font-black text-[9px] uppercase tracking-[0.2em] px-3 py-1 rounded-full border shadow-none",
                    config.color
                )}>
                    {config.label}
                </Badge>
            );
        }
    },
    {
        id: "actions",
        cell: ({ row }) => <ActionCell user={row.original} onDelete={onDelete} />,
    },
];