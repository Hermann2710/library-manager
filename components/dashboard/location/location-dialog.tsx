"use client"

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { locationSchema } from "@/lib/validation/location";
import { createLocation, updateLocation } from "@/actions/location-actions";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export function LocationDialog({ isOpen, onOpenChange, location }: any) {
    const queryClient = useQueryClient();
    const isEditing = !!location;

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(locationSchema as any),
        defaultValues: { name: "", description: "" }
    });

    useEffect(() => {
        if (location) reset(location);
        else reset({ name: "", description: "" });
    }, [location, reset, isOpen]);

    const { mutate, isPending } = useMutation({
        mutationFn: (data: any) => isEditing ? updateLocation(location._id, data) : createLocation(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["locations"] });
            toast.success(isEditing ? "Emplacement mis à jour" : "Emplacement créé");
            onOpenChange(false);
        },
        onError: (err: any) => toast.error(err.message)
    });

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Modifier l'emplacement" : "Nouvel emplacement"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Nom de l'emplacement</Label>
                        <Input {...register("name")} placeholder="ex: Rayon A1, Réserve..." />
                        {errors.name && <p className="text-xs text-destructive">{errors.name.message as string}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label>Description (Optionnel)</Label>
                        <Textarea {...register("description")} placeholder="Précisions sur l'accès ou le contenu..." />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
                        <Button type="submit" disabled={isPending}>Enregistrer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}