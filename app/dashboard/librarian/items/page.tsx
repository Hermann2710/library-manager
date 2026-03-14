"use client"

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getItems, deleteItem } from "@/actions/item-actions";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Plus, PackageSearch, Loader2, Barcode } from "lucide-react";
import { toast } from "sonner";
import { getItemColumns } from "@/components/dashboard/items/columns";
import { ItemDialog } from "@/components/dashboard/items/item-dialog";
import { DashboardContainer } from "@/components/shared/dashboard-container";
import { cn } from "@/lib/utils";

/**
 * ItemsPage Component:
 * Manages the physical units (exemplaires) of the library.
 * This is where staff tracks individual book conditions and barcode assignments.
 */
export default function ItemsPage() {
    const queryClient = useQueryClient();

    // UI states for modal management (Create vs Update)
    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<any>(null);

    /**
     * Inventory Data Fetching:
     * Retrieves all physical items including their linked Work (Title, Author)
     * and current availability status.
     */
    const { data = [], isLoading } = useQuery({
        queryKey: ["items"],
        queryFn: () => getItems()
    });

    /**
     * Deletion Mutation:
     * Removes an item from the catalog. 
     * Note: Server-side validation should prevent deleting items with active loans.
     */
    const { mutate: remove } = useMutation({
        mutationFn: deleteItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["items"] });
            toast.success("Exemplaire retiré de l'inventaire avec succès");
        },
        onError: (err: any) => {
            toast.error(err.message || "Erreur lors du retrait de l'exemplaire");
        }
    });

    // Opens the dialog with existing item data for modification
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
                    className="rounded-full font-black uppercase text-[10px] tracking-[0.2em] px-8 h-12 italic shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                >
                    <Plus className="mr-2 h-4 w-4" /> Ajouter un exemplaire
                </Button>
            }
        >
            <div className="space-y-8 animate-in fade-in duration-700">

                {/* INVENTORY TABLE CONTAINER: High-radius rounded aesthetics */}
                <div className={cn(
                    "relative p-1 rounded-[2.5rem] border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden shadow-xl shadow-black/5",
                    isLoading && "opacity-60"
                )}>
                    <DataTable
                        columns={getItemColumns(handleEdit, (id) => remove(id))}
                        data={data}
                        loading={isLoading}
                    />

                    {/* DEDICATED INVENTORY LOADER */}
                    {isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/10 backdrop-blur-[2px] z-10 rounded-[2.5rem]">
                            <div className="p-4 bg-background rounded-2xl shadow-lg border border-border/20">
                                <Barcode className="h-8 w-8 animate-pulse text-primary" />
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground">
                                    Scanning
                                </p>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground italic">
                                    Scan des codes-barres en cours...
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* BOTTOM INFO: Quick Audit reminder */}
                {!isLoading && (
                    <div className="flex items-center gap-4 p-6 bg-muted/20 rounded-[2rem] border border-dashed border-border/60">
                        <div className="p-3 bg-background rounded-2xl shadow-sm border border-border/10">
                            <PackageSearch className="h-5 w-5 text-muted-foreground/60" />
                        </div>
                        <div className="space-y-0.5">
                            <h4 className="text-[10px] font-black uppercase tracking-widest">Contrôle de l'Inventaire</h4>
                            <p className="text-[10px] text-muted-foreground italic font-medium">
                                {data.length} exemplaires physiques sont actuellement répertoriés dans votre système.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* SHARED MODAL: Handles both new entry and stock updates */}
            <ItemDialog
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                item={selectedItem}
            />
        </DashboardContainer>
    );
}