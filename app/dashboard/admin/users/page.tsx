"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllUsers, deleteUserAccount } from "@/actions/user-actions";
import { DataTable } from "@/components/shared/data-table";
import { getUserColumns } from "@/components/dashboard/users/columns";
import { ShieldAlert, Users, Loader2, UserCog } from "lucide-react";
import { toast } from "sonner";
import { DashboardContainer } from "@/components/shared/dashboard-container";
import { cn } from "@/lib/utils";

/**
 * AdminUsersPage: Managing user accounts and permissions.
 * Leverages TanStack Query for efficient client-side caching and 
 * optimistic UI updates.
 */
export default function AdminUsersPage() {
    const queryClient = useQueryClient();

    /**
     * Data Fetching:
     * 'users' query key ensures we can easily invalidate or refetch 
     * user data globally within the app.
     */
    const { data = [], isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: () => getAllUsers()
    });

    /**
     * Deletion Mutation:
     * When a user is deleted, we invalidate the 'users' cache to 
     * trigger an automatic background refresh of the table.
     */
    const { mutate: remove } = useMutation({
        mutationFn: deleteUserAccount,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
            toast.success("Compte supprimé définitivement");
        },
        onError: (err: any) => {
            toast.error(err.message || "Impossible de supprimer le compte");
        }
    });

    return (
        <DashboardContainer
            title="GESTION DES COMPTES"
            subtitle="Administration"
            description="Contrôlez les accès utilisateurs, modifiez les permissions et révoquez les accès au système."
            actions={
                <div className="flex items-center gap-3 bg-rose-500/10 text-rose-600 px-5 py-2 rounded-full border border-rose-500/20 shadow-sm shadow-rose-500/5 animate-pulse">
                    <ShieldAlert className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Zone Critique</span>
                </div>
            }
        >
            <div className="space-y-8 animate-in fade-in duration-700">
                {/* USER TABLE CONTAINER: High-contrast aesthetic with rounded corners */}
                <div className={cn(
                    "relative p-1 rounded-[2.5rem] border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden shadow-xl shadow-black/5",
                    isLoading && "opacity-60"
                )}>
                    <DataTable
                        columns={getUserColumns((id) => remove(id))}
                        data={data}
                        loading={isLoading}
                    />

                    {/* CUSTOM LOADER OVERLAY */}
                    {isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/20 backdrop-blur-[2px] z-10 rounded-[2.5rem]">
                            <div className="p-4 bg-background rounded-2xl shadow-lg border border-border/20">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">
                                    Sécurisation
                                </p>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground italic">
                                    Chargement de la base utilisateurs...
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* INFO FOOTER: Reassuring message for admin actions */}
                {!isLoading && (
                    <div className="flex items-center gap-4 p-6 bg-muted/20 rounded-3xl border border-dashed border-border/60">
                        <div className="p-3 bg-background rounded-2xl shadow-sm border border-border/10">
                            <UserCog className="h-5 w-5 text-muted-foreground/60" />
                        </div>
                        <div className="space-y-0.5">
                            <h4 className="text-[10px] font-black uppercase tracking-widest">Contrôle de sécurité</h4>
                            <p className="text-[10px] text-muted-foreground italic font-medium">
                                Chaque modification de rôle ou suppression est enregistrée dans l'audit système.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </DashboardContainer>
    );
}