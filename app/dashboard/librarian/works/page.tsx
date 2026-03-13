"use client"

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getWorks, deleteWork } from "@/actions/work-actions";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Library } from "lucide-react";
import { toast } from "sonner";
import { getWorkColumns } from "@/components/dashboard/works/columns";
import { WorkDialog } from "@/components/dashboard/works/work-dialog";

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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Library className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Catalogue</h1>
                        <p className="text-muted-foreground text-sm">Gestion des œuvres et des références bibliographiques.</p>
                    </div>
                </div>
                <Button onClick={() => { setSelectedWork(null); setIsDialogOpen(true); }}>
                    <Plus className="mr-2 h-4 w-4" /> Ajouter une œuvre
                </Button>
            </div>

            <DataTable
                columns={getWorkColumns((w) => { setSelectedWork(w); setIsDialogOpen(true); }, (id) => deleteMutation.mutate(id))}
                data={works}
                loading={isLoading}
            />

            <WorkDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                work={selectedWork}
            />
        </div>
    );
}