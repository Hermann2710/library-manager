"use client"

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWorks, deleteWork } from "@/actions/work-actions";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Library, Loader2, BookOpenCheck, Database } from "lucide-react";
import { toast } from "sonner";
import { getWorkColumns } from "@/components/dashboard/works/columns";
import { WorkDialog } from "@/components/dashboard/works/work-dialog";
import { DashboardContainer } from "@/components/shared/dashboard-container";
import { cn } from "@/lib/utils";

/**
 * WorksPage Component:
 * The central bibliographic repository of LibManager.
 * Manages the "Work" entities (books/references) before they are assigned to physical copies.
 */
export default function WorksPage() {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedWork, setSelectedWork] = useState<any>(null);

    /**
     * Catalog Retrieval:
     * Fetches all bibliographic references with populated relations (authors, categories).
     */
    const { data: works = [], isLoading } = useQuery({
        queryKey: ["works"],
        queryFn: () => getWorks(),
    });

    /**
     * Catalog Deletion:
     * Removes a work from the reference list.
     * Note: This usually requires checking for existing physical copies (Inventory).
     */
    const deleteMutation = useMutation({
        mutationFn: deleteWork,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["works"] });
            toast.success("Registre mis à jour : Référence retirée du catalogue");
        },
        onError: (err: any) => {
            toast.error(err.message || "Erreur lors de la suppression de l'œuvre");
        }
    });

    /**
     * Edit Handler:
     * Prepares the specific work for update in the shared dialog.
     */
    const handleEdit = (work: any) => {
        setSelectedWork(work);
        setIsDialogOpen(true);
    };

    return (
        <DashboardContainer
            title="CATALOGUE"
            subtitle="Inventaire"
            description="Gérez les références bibliographiques, les auteurs et les métadonnées des œuvres."
            actions={
                <Button
                    onClick={() => { setSelectedWork(null); setIsDialogOpen(true); }}
                    className="rounded-full font-black uppercase text-[10px] tracking-[0.2em] px-8 h-12 italic shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                >
                    <Plus className="mr-2 h-4 w-4" /> Ajouter une œuvre
                </Button>
            }
        >
            <div className="space-y-8 animate-in fade-in duration-700">

                {/* CATALOG TABLE: High-end container for bibliographic data */}
                <div className={cn(
                    "relative p-1 rounded-[2.5rem] border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl shadow-black/5",
                    isLoading && "opacity-60"
                )}>
                    <DataTable
                        columns={getWorkColumns(
                            handleEdit,
                            (id) => deleteMutation.mutate(id)
                        )}
                        data={works}
                        loading={isLoading}
                    />

                    {/* CONTEXTUAL CATALOG LOADER */}
                    {isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/20 backdrop-blur-xs z-10 rounded-[2.5rem]">
                            <div className="p-6 bg-background rounded-[2rem] shadow-2xl border border-border/20">
                                <Library className="h-8 w-8 animate-pulse text-primary" />
                            </div>
                            <div className="text-center">
                                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-foreground">
                                    LibManager Index
                                </p>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground italic mt-1">
                                    Chargement du catalogue général...
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* SYSTEM INSIGHTS: Operational metadata */}
                {!isLoading && (
                    <div className="flex flex-wrap items-center gap-6 p-6 bg-primary/5 rounded-[2rem] border border-dashed border-primary/20">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-background rounded-2xl shadow-sm border border-border/10">
                                <Database className="h-5 w-5 text-primary/60" />
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/80">Base de données</h4>
                                <p className="text-[10px] text-muted-foreground italic font-medium">
                                    {works.length} références bibliographiques indexées.
                                </p>
                            </div>
                        </div>

                        <div className="hidden sm:flex items-center gap-4 border-l border-primary/10 pl-6">
                            <div className="p-3 bg-background rounded-2xl shadow-sm border border-border/10">
                                <BookOpenCheck className="h-5 w-5 text-emerald-600/60" />
                            </div>
                            <div className="space-y-0.5">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-emerald-700/80">Intégrité</h4>
                                <p className="text-[10px] text-muted-foreground italic font-medium">
                                    Données synchronisées en temps réel.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* SHARED WORK DIALOG: Bibliographic input system */}
            <WorkDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                work={selectedWork}
            />
        </DashboardContainer>
    );
}