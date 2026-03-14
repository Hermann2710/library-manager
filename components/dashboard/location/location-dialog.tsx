"use client"

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { locationSchema } from "@/lib/validation/location";
import { createLocation, updateLocation } from "@/actions/location-actions";
import { toast } from "sonner";
import { MapPinned, Info, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * LocationDialog: Specialized form for managing physical storage zones.
 * It handles the creation and metadata updates for aisles, shelves, or rooms.
 */
export function LocationDialog({ isOpen, onOpenChange, location }: any) {
    const queryClient = useQueryClient();
    const isEditing = !!location;

    // Form Initialization with Zod validation for logistics safety
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(locationSchema as any),
        defaultValues: { name: "", description: "" }
    });

    /**
     * Effect Hook: Synchronizes form state with the selected location.
     * Clears the form when closing or switching to 'Create' mode.
     */
    useEffect(() => {
        if (location && isOpen) {
            reset({
                name: location.name,
                description: location.description || ""
            });
        } else if (!isOpen) {
            reset({ name: "", description: "" });
        }
    }, [location, reset, isOpen]);

    // Mutation Logic for persistent storage updates
    const { mutate, isPending } = useMutation({
        mutationFn: (data: any) => isEditing ? updateLocation(location._id, data) : createLocation(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["locations"] });
            toast.success(isEditing ? "Zone de stockage mise à jour" : "Nouvel emplacement cartographié");
            onOpenChange(false);
        },
        onError: (err: any) => toast.error(err.message || "Erreur lors de la configuration de la zone")
    });

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md rounded-[3rem] border-border/40 p-8 shadow-2xl">
                <DialogHeader className="flex flex-row items-center gap-4 mb-6">
                    <div className="bg-primary/10 p-3 rounded-2xl border border-primary/20">
                        <MapPinned className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">
                            {isEditing ? "Éditer la Zone" : "Nouvelle Zone"}
                        </DialogTitle>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                            Logistique & Stockage
                        </p>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-6">
                    {/* SECTION: Identification */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest ml-1">
                            Nom de l'emplacement
                        </Label>
                        <Input
                            {...register("name")}
                            placeholder="ex: Rayon A1, Réserve Nord..."
                            className="rounded-xl h-11 border-border/60 focus:ring-primary/20"
                        />
                        {errors.name && (
                            <p className="text-[10px] font-bold text-destructive px-1 italic">
                                {errors.name.message as string}
                            </p>
                        )}
                    </div>

                    {/* SECTION: Details */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Info className="h-3 w-3" /> Description (Optionnel)
                        </Label>
                        <Textarea
                            {...register("description")}
                            placeholder="Précisez l'accès, le type de documents ou la capacité..."
                            className="min-h-25 rounded-2xl border-border/60 focus:ring-primary/20 resize-none p-4 text-sm"
                        />
                    </div>

                    {/* DECORATIVE LOGISTICS HINT */}
                    <div className="p-4 bg-muted/30 rounded-2xl border border-dashed border-border/60">
                        <p className="text-[9px] text-muted-foreground leading-relaxed italic font-medium">
                            Assurez-vous que le nom est unique pour faciliter l'inventaire physique et le repérage par les membres.
                        </p>
                    </div>

                    <DialogFooter className="pt-4 gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="rounded-xl font-bold uppercase text-[10px] tracking-widest"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="rounded-2xl h-12 px-8 font-black uppercase text-[10px] tracking-[0.2em] italic shadow-lg shadow-primary/20 min-w-35"
                        >
                            {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Enregistrer"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}