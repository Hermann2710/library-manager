"use client"

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { itemSchema } from "@/lib/validation/item";
import { createItem, updateItem, getLocations } from "@/actions/item-actions";
import { getWorks } from "@/actions/work-actions";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ItemDialog({ isOpen, onOpenChange, item }: any) {
    const queryClient = useQueryClient();
    const isEditing = !!item;

    const { data: works = [] } = useQuery({ queryKey: ["works"], queryFn: () => getWorks() });
    const { data: locations = [] } = useQuery({ queryKey: ["locations"], queryFn: () => getLocations() });

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
        resolver: zodResolver(itemSchema as any),
        defaultValues: {
            status: "Available",
            condition: "Good",
            barcode: ""
        }
    });

    useEffect(() => {
        if (item) {
            reset({
                ...item,
                work: item.work?._id || item.work,
                location: item.location?._id || item.location
            });
        } else {
            reset({ status: "Available", condition: "Good", barcode: "" });
        }
    }, [item, reset, isOpen]);

    const { mutate, isPending } = useMutation({
        mutationFn: (data: any) => isEditing ? updateItem(item._id, data) : createItem(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["items"] });
            toast.success(isEditing ? "Exemplaire modifié" : "Exemplaire ajouté");
            onOpenChange(false);
        },
        onError: (err: any) => toast.error(err.message)
    });

    const generateBarcode = () => {
        const date = new Date().getFullYear();
        const random = Math.floor(1000 + Math.random() * 9000);
        setValue("barcode", `LIB-${date}-${random}`);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Gérer l'exemplaire" : "Ajouter un exemplaire"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Œuvre correspondante</Label>
                        <select {...register("work")} className="w-full h-10 border rounded-md px-3 text-sm">
                            <option value="">Sélectionner une œuvre...</option>
                            {works.map((w: any) => (
                                <option key={w._id} value={w._id}>{w.title}</option>
                            ))}
                        </select>
                        {errors.work && <p className="text-xs text-destructive">{errors.work.message as string}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Code-barres unique</Label>
                        <div className="flex gap-2">
                            <Input {...register("barcode")} placeholder="Ex: LIB-2026-0001" />
                            <Button type="button" variant="outline" size="icon" onClick={generateBarcode}>
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>État physique</Label>
                            <select {...register("condition")} className="w-full h-10 border rounded-md px-3 text-sm">
                                <option value="New">Neuf</option>
                                <option value="Good">Bon état</option>
                                <option value="Worn">Usé</option>
                                <option value="Damaged">Abîmé</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Statut</Label>
                            <select {...register("status")} className="w-full h-10 border rounded-md px-3 text-sm">
                                <option value="Available">Disponible</option>
                                <option value="Maintenance">En réparation</option>
                                <option value="Lost">Perdu</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Emplacement (Rayon/Salle)</Label>
                        <select {...register("location")} className="w-full h-10 border rounded-md px-3 text-sm">
                            <option value="">Choisir un emplacement...</option>
                            {locations.map((l: any) => (
                                <option key={l._id} value={l._id}>{l.name}</option>
                            ))}
                        </select>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
                        <Button type="submit" disabled={isPending}>Confirmer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}