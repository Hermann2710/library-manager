"use client"

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMembers } from "@/actions/member-actions";
import { DataTable } from "@/components/shared/data-table";
import { MemberDialog } from "@/components/dashboard/members/member-dialog";
import { getMemberColumns } from "@/components/dashboard/members/columns";
import { Users, UserPlus, Loader2 } from "lucide-react";
import { DashboardContainer } from "@/components/shared/dashboard-container";
import { Button } from "@/components/ui/button";

export default function MembersPage() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<any>(null);

    const { data = [], isLoading } = useQuery({
        queryKey: ["members"],
        queryFn: () => getMembers()
    });

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
                <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-2 mr-2 bg-primary/5 px-3 py-1.5 rounded-full border border-primary/10">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{data.length} Membres</span>
                    </div>
                </div>
            }
        >
            <div className="space-y-6">
                <div className="rounded-md p-4 border bg-card shadow-sm overflow-hidden">
                    <DataTable
                        columns={getMemberColumns(handleEdit)}
                        data={data}
                        loading={isLoading}
                    />
                </div>

                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <Loader2 className="h-6 w-6 animate-spin text-primary/30" />
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                            Lecture de la base de données...
                        </p>
                    </div>
                )}
            </div>

            <MemberDialog
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                member={selectedMember}
            />
        </DashboardContainer>
    );
}