"use client"

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMembers } from "@/actions/member-actions";
import { DataTable } from "@/components/shared/data-table";
import { MemberDialog } from "@/components/dashboard/members/member-dialog";
import { getMemberColumns } from "@/components/dashboard/members/columns";
import { Users, UserPlus, Loader2, ShieldCheck } from "lucide-react";
import { DashboardContainer } from "@/components/shared/dashboard-container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * MembersPage Component:
 * Centralized directory for library members.
 * Handles the administrative view of user profiles, membership status, and registration.
 */
export default function MembersPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<any>(null);

    /**
     * Community Data Fetching:
     * Retrieves the full list of members including linked user accounts and loan history.
     */
    const { data = [], isLoading } = useQuery({
        queryKey: ["members"],
        queryFn: () => getMembers()
    });

    /**
     * Update Trigger:
     * Prepares the selected member data for the dialog.
     */
    const handleEdit = (member: any) => {
        setSelectedMember(member);
        setIsOpen(true);
    };

    return (
        <DashboardContainer
            title="GESTION DES MEMBRES"
            subtitle="Communauté"
            description="Suivez les adhésions, gérez les coordonnées des lecteurs et contrôlez le statut des cotisations."
            actions={
                <div className="flex items-center gap-3">
                    {/* STATS BADGE: Real-time community count */}
                    <div className="hidden sm:flex items-center gap-2.5 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-2xl border border-border/40 shadow-sm">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground">
                            {data.length} Membres
                        </span>
                    </div>
                </div>
            }
        >
            <div className="space-y-8 animate-in fade-in duration-700">

                {/* DIRECTORY TABLE: High-radius premium container */}
                <div className={cn(
                    "relative p-1 rounded-[2.5rem] border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden shadow-xl shadow-black/5",
                    isLoading && "opacity-60"
                )}>
                    <DataTable
                        columns={getMemberColumns(handleEdit)}
                        data={data}
                        loading={isLoading}
                    />

                    {/* DEDICATED DATABASE LOADER */}
                    {isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/10 backdrop-blur-[2px] z-10 rounded-[2.5rem]">
                            <div className="p-5 bg-background rounded-3xl shadow-xl border border-border/20">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground">
                                    Authentification
                                </p>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground italic">
                                    Lecture du registre des lecteurs...
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* COMPLIANCE & SECURITY BANNER */}
                {!isLoading && (
                    <div className="flex items-center gap-4 p-6 bg-emerald-500/5 rounded-[2rem] border border-dashed border-emerald-500/20">
                        <div className="p-3 bg-background rounded-2xl shadow-sm border border-border/10">
                            <ShieldCheck className="h-5 w-5 text-emerald-600/60" />
                        </div>
                        <div className="space-y-0.5">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Intégrité des Données</h4>
                            <p className="text-[10px] text-muted-foreground italic font-medium">
                                Les informations personnelles sont protégées. Seuls les administrateurs peuvent modifier les informations sensibles.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* MEMBER MODAL: Shared logic for Registration and Profile Management */}
            <MemberDialog
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                member={selectedMember}
            />
        </DashboardContainer>
    );
}