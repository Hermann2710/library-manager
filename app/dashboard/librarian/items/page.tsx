"use client"

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getItems, deleteItem } from "@/actions/item-actions";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Plus, PackageSearch } from "lucide-react";
import { toast } from "sonner";
import { getItemColumns } from "@/components/dashboard/items/columns";
import { ItemDialog } from "@/components/dashboard/items/item-dialog";

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
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Inventaire</h1>
                    <p className="text-muted-foreground text-sm">Gérez les exemplaires physiques et leurs statuts.</p>
                </div>
                <Button onClick={() => { setSelectedItem(null); setIsOpen(true); }}>
                    <Plus className="mr-2 h-4 w-4" /> Ajouter un exemplaire
                </Button>
            </div>

            <DataTable
                columns={getItemColumns(handleEdit, (id) => remove(id))}
                data={data}
                loading={isLoading}
            />

            <ItemDialog
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                item={selectedItem}
            />
        </div>
    );
}