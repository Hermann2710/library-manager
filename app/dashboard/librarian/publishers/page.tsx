"use client"

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPublishers, deletePublisher } from "@/actions/publisher-actions";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { getPublisherColumns } from "@/components/dashboard/publishers/columns";
import { PublisherDialog } from "@/components/dashboard/publishers/publisher-dialog";

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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Éditeurs</h1>
                    <p className="text-muted-foreground">Gérez les maisons d'édition partenaires.</p>
                </div>
                <Button onClick={() => { setSelectedPublisher(null); setIsDialogOpen(true); }}>
                    <Plus className="mr-2 h-4 w-4" /> Ajouter
                </Button>
            </div>

            <DataTable
                columns={getPublisherColumns(handleEdit, (id) => deleteMutation.mutate(id))}
                data={publishers}
                loading={isLoading}
            />

            <PublisherDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                publisher={selectedPublisher}
            />
        </div>
    );
}