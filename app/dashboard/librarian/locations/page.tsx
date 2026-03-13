"use client"

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLocations, deleteLocation } from "@/actions/location-actions";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Plus, MapPinned, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { LocationDialog } from "@/components/dashboard/location/location-dialog";
import { getLocationColumns } from "@/components/dashboard/location/columns";
import { DashboardContainer } from "@/components/shared/dashboard-container";

export default function LocationsPage() {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<any>(null);

    const { data = [], isLoading } = useQuery({
        queryKey: ["locations"],
        queryFn: () => getLocations()
    });

    const { mutate: remove } = useMutation({
        mutationFn: deleteLocation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["locations"] });
            toast.success("Emplacement supprimé");
        },
        onError: (err: any) => toast.error(err.message)
    });

    const handleEdit = (loc: any) => {
        setSelectedLocation(loc);
        setIsOpen(true);
    };

    return (
        <DashboardContainer
            title="EMPLACEMENTS"
            subtitle="Logistique"
            description="Configurez les zones de stockage physiques, les rayons et les bibliothèques de l'établissement."
            actions={
                <Button
                    onClick={() => { setSelectedLocation(null); setIsOpen(true); }}
                    className="rounded-full font-black uppercase text-[10px] tracking-widest px-6 italic"
                >
                    <Plus className="mr-2 h-4 w-4" /> Ajouter une zone
                </Button>
            }
        >
            <div className="space-y-6">
                <div className="rounded-md p-4 border bg-card shadow-sm overflow-hidden">
                    <DataTable
                        columns={getLocationColumns(handleEdit, (id) => remove(id))}
                        data={data}
                        loading={isLoading}
                    />
                </div>

                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <Loader2 className="h-6 w-6 animate-spin text-primary/30" />
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                            Cartographie des rayons...
                        </p>
                    </div>
                )}
            </div>

            <LocationDialog
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                location={selectedLocation}
            />
        </DashboardContainer>
    );
}