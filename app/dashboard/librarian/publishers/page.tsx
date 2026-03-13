"use client"

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPublishers, deletePublisher } from "@/actions/publisher-actions";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Landmark, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getPublisherColumns } from "@/components/dashboard/publishers/columns";
import { PublisherDialog } from "@/components/dashboard/publishers/publisher-dialog";
import { DashboardContainer } from "@/components/shared/dashboard-container";

export default function PublishersPage() {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedPublisher, setSelectedPublisher] = useState<any>(null);

    const { data: publishers = [], isLoading } = useQuery({
        queryKey: ["publishers"],
        queryFn: () => getPublishers(),
    });

    const deleteMutation = useMutation({
        mutationFn: deletePublisher,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["publishers"] });
            toast.success("Éditeur supprimé");
        },
    });

    const handleEdit = (pub: any) => {
        setSelectedPublisher(pub);
        setIsDialogOpen(true);
    };

    return (
        <DashboardContainer
            title="ÉDITEURS"
            subtitle="Partenaires"
            description="Gérez les maisons d'édition, leurs coordonnées et leur historique de publication."
            actions={
                <Button
                    onClick={() => { setSelectedPublisher(null); setIsDialogOpen(true); }}
                    className="rounded-full font-black uppercase text-[10px] tracking-widest px-6 italic"
                >
                    <Plus className="mr-2 h-4 w-4" /> Ajouter un éditeur
                </Button>
            }
        >
            <div className="space-y-6">
                <div className="rounded-md p-4 border bg-card shadow-sm overflow-hidden">
                    <DataTable
                        columns={getPublisherColumns(handleEdit, (id) => deleteMutation.mutate(id))}
                        data={publishers}
                        loading={isLoading}
                    />
                </div>

                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-10 gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-primary/40" />
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                            Chargement des partenaires...
                        </p>
                    </div>
                )}
            </div>

            <PublisherDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                publisher={selectedPublisher}
            />
        </DashboardContainer>
    );
}