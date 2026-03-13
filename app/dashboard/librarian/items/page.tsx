"use client"

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getItems, deleteItem } from "@/actions/item-actions";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Plus, PackageSearch, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getItemColumns } from "@/components/dashboard/items/columns";
import { ItemDialog } from "@/components/dashboard/items/item-dialog";
import { DashboardContainer } from "@/components/shared/dashboard-container";

export default function ItemsPage() {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const { data = [], isLoading } = useQuery({
        queryKey: ["items"],
        queryFn: () => getItems()
    });

    const { mutate: remove } = useMutation({
        mutationFn: deleteItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["items"] });
            toast.success("Exemplaire retiré de l'inventaire");
        }
    });

    const handleEdit = (item: any) => {
        setSelectedItem(item);
        setIsOpen(true);
    };

    return (
        <DashboardContainer
            title="INVENTAIRE"
            subtitle="Unités Physiques"
            description="Gérez les exemplaires individuels, suivez leur état d'usure et mettez à jour leur disponibilité."
            actions={
                <Button
                    onClick={() => { setSelectedItem(null); setIsOpen(true); }}
                    className="rounded-full font-black uppercase text-[10px] tracking-widest px-6 italic"
                >
                    <Plus className="mr-2 h-4 w-4" /> Ajouter un exemplaire
                </Button>
            }
        >
            <div className="space-y-6">
                <div className="rounded-md p-4 border bg-card shadow-sm overflow-hidden">
                    <DataTable
                        columns={getItemColumns(handleEdit, (id) => remove(id))}
                        data={data}
                        loading={isLoading}
                    />
                </div>

                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <Loader2 className="h-6 w-6 animate-spin text-primary/30" />
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                            Scan des codes-barres en cours...
                        </p>
                    </div>
                )}
            </div>

            <ItemDialog
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                item={selectedItem}
            />
        </DashboardContainer>
    );
}