"use client"

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMembers } from "@/actions/member-actions";
import { DataTable } from "@/components/shared/data-table";
import { MemberDialog } from "@/components/dashboard/members/member-dialog";
import { getMemberColumns } from "@/components/dashboard/members/columns";
import { Users } from "lucide-react";

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
        <div className="flex flex-col gap-6 p-4 md:p-8">
            <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <Users className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gestion des Membres</h1>
                    <p className="text-muted-foreground text-sm">
                        Suivez les adhésions et les coordonnées des lecteurs.
                    </p>
                </div>
            </div>

            <DataTable
                columns={getMemberColumns(handleEdit)}
                data={data}
                loading={isLoading}
            />

            <MemberDialog
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                member={selectedMember}
            />
        </div>
    );
}