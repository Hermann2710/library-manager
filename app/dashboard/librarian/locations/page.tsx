"use client"

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLocations, deleteLocation } from "@/actions/location-actions";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Plus, MapPinned } from "lucide-react";
import { toast } from "sonner";
import { LocationDialog } from "@/components/dashboard/location/location-dialog";
import { getLocationColumns } from "@/components/dashboard/location/columns";

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
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Emplacements</h1>
                    <p className="text-muted-foreground text-sm">Configurez les zones de stockage physiques.</p>
                </div>
                <Button onClick={() => { setSelectedLocation(null); setIsOpen(true); }}>
                    <Plus className="mr-2 h-4 w-4" /> Ajouter une zone
                </Button>
            </div>

            <DataTable
                columns={getLocationColumns(handleEdit, (id) => remove(id))}
                data={data}
                loading={isLoading}
            />

            <LocationDialog
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                location={selectedLocation}
            />
        </div>
    );
}