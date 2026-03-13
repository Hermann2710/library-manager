"use client"

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWorks, deleteWork } from "@/actions/work-actions";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Library, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getWorkColumns } from "@/components/dashboard/works/columns";
import { WorkDialog } from "@/components/dashboard/works/work-dialog";
import { DashboardContainer } from "@/components/shared/dashboard-container";

export default function WorksPage() {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedWork, setSelectedWork] = useState<any>(null);

    const { data: works = [], isLoading } = useQuery({
        queryKey: ["works"],
        queryFn: () => getWorks(),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteWork,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["works"] });
            toast.success("Œuvre retirée du catalogue");
        },
    });

    return (
        <DashboardContainer
            title="CATALOGUE"
            subtitle="Inventaire"
            description="Gérez les références bibliographiques, les auteurs et les métadonnées des œuvres."
            actions={
                <Button
                    onClick={() => { setSelectedWork(null); setIsDialogOpen(true); }}
                    className="rounded-full font-black uppercase text-[10px] tracking-widest px-6 italic"
                >
                    <Plus className="mr-2 h-4 w-4" /> Ajouter une œuvre
                </Button>
            }
        >
            <div className="space-y-6">
                <div className="rounded-sm p-4 border bg-card shadow-sm overflow-hidden">
                    <DataTable
                        columns={getWorkColumns(
                            (w) => { setSelectedWork(w); setIsDialogOpen(true); },
                            (id) => deleteMutation.mutate(id)
                        )}
                        data={works}
                        loading={isLoading}
                    />
                </div>

                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-10 gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-primary/40" />
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                            Indexation du catalogue...
                        </p>
                    </div>
                )}
            </div>

            <WorkDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                work={selectedWork}
            />
        </DashboardContainer>
    );
}