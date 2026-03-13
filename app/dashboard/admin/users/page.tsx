"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, deleteUserAccount } from "@/actions/user-actions";
import { DataTable } from "@/components/shared/data-table";
import { getUserColumns } from "@/components/dashboard/users/columns";
import { ShieldAlert, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { DashboardContainer } from "@/components/shared/dashboard-container";

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
        <DashboardContainer
            title="GESTION DES COMPTES"
            subtitle="Administration"
            description="Contrôlez les accès utilisateurs, modifiez les permissions et révoquez les accès au système."
            actions={
                <div className="flex items-center gap-2 bg-rose-500/10 text-rose-600 px-3 py-1.5 rounded-full border border-rose-500/20 shadow-sm">
                    <ShieldAlert className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Zone Critique</span>
                </div>
            }
        >
            <div className="space-y-6">
                {/* Statistiques rapides ou filtres peuvent aller ici */}
                <div className="p-4  rounded-sm border bg-card shadow-sm overflow-hidden">
                    <DataTable
                        columns={getUserColumns((id) => remove(id))}
                        data={data}
                        loading={isLoading}
                    />
                </div>

                {isLoading && (
                    <div className="flex items-center justify-center py-10 gap-3">
                        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            Sécurisation des données...
                        </p>
                    </div>
                )}
            </div>
        </DashboardContainer>
    );
}