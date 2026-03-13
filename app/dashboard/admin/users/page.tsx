"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, deleteUserAccount } from "@/actions/user-actions";
import { DataTable } from "@/components/shared/data-table";
import { getUserColumns } from "@/components/dashboard/users/columns";
import { Users, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export default function AdminUsersPage() {
    const queryClient = useQueryClient();

    const { data = [], isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: () => getAllUsers()
    });

    const { mutate: remove } = useMutation({
        mutationFn: deleteUserAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("Compte supprimé définitivement");
        },
        onError: (err: any) => toast.error(err.message)
    });

    return (
        <div className="flex flex-col gap-6 p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-500/10 rounded-lg text-rose-600">
                        <ShieldAlert className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Gestion des Comptes</h1>
                        <p className="text-muted-foreground text-sm">Contrôlez les accès et les permissions du système.</p>
                    </div>
                </div>
            </div>

            <DataTable
                columns={getUserColumns((id) => remove(id))}
                data={data}
                loading={isLoading}
            />
        </div>
    );
}