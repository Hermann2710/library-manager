"use client"

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLocations, deleteLocation } from "@/actions/location-actions";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Plus, MapPinned, Loader2, Map } from "lucide-react";
import { toast } from "sonner";
import { LocationDialog } from "@/components/dashboard/location/location-dialog";
import { getLocationColumns } from "@/components/dashboard/location/columns";
import { DashboardContainer } from "@/components/shared/dashboard-container";
import { cn } from "@/lib/utils";

/**
 * LocationsPage Component:
 * Manages the physical map of the library. 
 * Defines zones, aisles, and specific storage units for item placement.
 */
export default function LocationsPage() {
    const queryClient = useQueryClient();

    // UI states for modal lifecycle (Add vs Edit)
    const [isOpen, setIsOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<any>(null);

    /**
     * Logistics Data Fetching:
     * Retrieves all physical zones defined in the system.
     */
    const { data = [], isLoading } = useQuery({
        queryKey: ["locations"],
        queryFn: () => getLocations()
    });

    /**
     * Deletion Mutation:
     * Removes a storage zone. 
     * Note: Server-side logic should block deletion if items are still assigned.
     */
    const { mutate: remove } = useMutation({
        mutationFn: deleteLocation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["locations"] });
            toast.success("Logistique : Zone retirée de la cartographie");
        },
        onError: (err: any) => {
            toast.error(err.message || "Impossible de supprimer cet emplacement");
        }
    });

    // Opens the dialog for updating an existing zone
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
                    className="rounded-full font-black uppercase text-[10px] tracking-[0.2em] px-8 h-12 italic shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                >
                    <Plus className="mr-2 h-4 w-4" /> Ajouter une zone
                </Button>
            }
        >
            <div className="space-y-8 animate-in fade-in duration-700">

                {/* LOCATIONS TABLE: Premium Glassmorphism Container */}
                <div className={cn(
                    "relative p-1 rounded-[2.5rem] border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden shadow-xl shadow-black/5",
                    isLoading && "opacity-60"
                )}>
                    <DataTable
                        columns={getLocationColumns(handleEdit, (id) => remove(id))}
                        data={data}
                        loading={isLoading}
                    />

                    {/* DEDICATED LOGISTICS LOADER */}
                    {isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/10 backdrop-blur-[2px] z-10 rounded-[2.5rem]">
                            <div className="p-4 bg-background rounded-2xl shadow-lg border border-border/20">
                                <MapPinned className="h-8 w-8 animate-bounce text-primary" />
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground">
                                    Navigation
                                </p>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground italic">
                                    Cartographie des rayons...
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* LOGISTICS INSIGHTS */}
                {!isLoading && (
                    <div className="flex items-center gap-4 p-6 bg-primary/5 rounded-[2rem] border border-dashed border-primary/20">
                        <div className="p-3 bg-background rounded-2xl shadow-sm border border-border/10">
                            <Map className="h-5 w-5 text-primary/60" />
                        </div>
                        <div className="space-y-0.5">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/80">État de l'Espace</h4>
                            <p className="text-[10px] text-muted-foreground italic font-medium">
                                {data.length} zones de stockage actives sont configurées pour accueillir le catalogue.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* SHARED MODAL: Handles zone creation and metadata updates */}
            <LocationDialog
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                location={selectedLocation}
            />
        </DashboardContainer>
    );
}