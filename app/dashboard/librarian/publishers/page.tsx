"use client"

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPublishers, deletePublisher } from "@/actions/publisher-actions";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Landmark, Loader2, BookCopy } from "lucide-react";
import { toast } from "sonner";
import { getPublisherColumns } from "@/components/dashboard/publishers/columns";
import { PublisherDialog } from "@/components/dashboard/publishers/publisher-dialog";
import { DashboardContainer } from "@/components/shared/dashboard-container";
import { cn } from "@/lib/utils";

/**
 * PublishersPage Component:
 * Administrative hub for managing publishing houses.
 * Handles the catalog of partners and their legal/contact metadata.
 */
export default function PublishersPage() {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedPublisher, setSelectedPublisher] = useState<any>(null);

    /**
     * Data Fetching:
     * Retrieves the list of publishers from the database via React Query.
     */
    const { data: publishers = [], isLoading } = useQuery({
        queryKey: ["publishers"],
        queryFn: () => getPublishers(),
    });

    /**
     * Deletion Mutation:
     * Removes a publisher entry with automatic cache invalidation.
     */
    const deleteMutation = useMutation({
        mutationFn: deletePublisher,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["publishers"] });
            toast.success("Registre mis à jour : Maison d'édition supprimée");
        },
        onError: (error: any) => {
            toast.error(error.message || "Erreur lors de la suppression");
        }
    });

    /**
     * Edit Handler:
     * Sets the target publisher and triggers the configuration dialog.
     */
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
                    className="rounded-full font-black uppercase text-[10px] tracking-[0.2em] px-8 h-12 italic shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                >
                    <Plus className="mr-2 h-4 w-4" /> Ajouter un éditeur
                </Button>
            }
        >
            <div className="space-y-8 animate-in fade-in duration-700">

                {/* PARTNERS TABLE: Premium Glass-rounded container */}
                <div className={cn(
                    "relative p-1 rounded-[2.5rem] border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden shadow-xl shadow-black/5",
                    isLoading && "opacity-60"
                )}>
                    <DataTable
                        columns={getPublisherColumns(handleEdit, (id) => deleteMutation.mutate(id))}
                        data={publishers}
                        loading={isLoading}
                    />

                    {/* CONTEXTUAL PARTNER LOADER */}
                    {isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/10 backdrop-blur-[2px] z-10 rounded-[2.5rem]">
                            <div className="p-5 bg-background rounded-3xl shadow-xl border border-border/20">
                                <Landmark className="h-8 w-8 animate-pulse text-primary" />
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground">
                                    Maison d'Édition
                                </p>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground italic">
                                    Synchronisation des partenaires...
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* LOGISTICS INSIGHTS BAR */}
                {!isLoading && (
                    <div className="flex items-center gap-4 p-6 bg-primary/5 rounded-[2rem] border border-dashed border-primary/20">
                        <div className="p-3 bg-background rounded-2xl shadow-sm border border-border/10">
                            <BookCopy className="h-5 w-5 text-primary/60" />
                        </div>
                        <div className="space-y-0.5">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/80">Réseau d'Édition</h4>
                            <p className="text-[10px] text-muted-foreground italic font-medium">
                                {publishers.length} maisons d'édition sont actuellement référencées dans votre catalogue.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* SHARED MODAL: Handling Create/Edit workflows */}
            <PublisherDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                publisher={selectedPublisher}
            />
        </DashboardContainer>
    );
}