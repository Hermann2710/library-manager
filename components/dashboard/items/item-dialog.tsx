"use client"

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { itemSchema } from "@/lib/validation/item";
import { createItem, updateItem } from "@/actions/item-actions";
import { getWorks } from "@/actions/work-actions";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { getLocations } from "@/actions/location-actions";

export function ItemDialog({ isOpen, onOpenChange, item }: any) {
    const queryClient = useQueryClient();
    const isEditing = !!item;

    const { data: works = [] } = useQuery({ queryKey: ["works"], queryFn: () => getWorks() });
    const { data: locations = [] } = useQuery({ queryKey: ["locations"], queryFn: () => getLocations() });

    const { register, handleSubmit, reset, setValue, control, formState: { errors } } = useForm({
        resolver: zodResolver(itemSchema as any),
        defaultValues: {
            status: "Available",
            condition: "Good",
            barcode: "",
            work: "",
            location: ""
        }
    });

    useEffect(() => {
        if (item) {
            reset({
                ...item,
                work: item.work?._id || item.work,
                location: item.location?._id || item.location,
                status: item.status,
                condition: item.condition,
                barcode: item.barcode
            });
        } else {
            reset({ status: "Available", condition: "Good", barcode: "", work: "", location: "" });
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

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Gérer l'exemplaire" : "Ajouter un exemplaire"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
                    {/* Sélection de l'œuvre */}
                    <div className="space-y-2">
                        <Label>Œuvre correspondante</Label>
                        <Controller
                            control={control}
                            name="work"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Choisir une œuvre" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" sideOffset={4} className="w-(--radix-select-trigger-width)">
                                        {works.length > 0 ? works.map((w: any) => (
                                            <SelectItem key={w._id} value={w._id}>
                                                {w.title}
                                            </SelectItem>
                                        )) : <SelectItem value="none" disabled>Aucune œuvre disponible</SelectItem>}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.work && <p className="text-xs text-destructive">{errors.work.message as string}</p>}
                    </div>

                    {/* Code-barres */}
                    <div className="space-y-2">
                        <Label>Code-barres unique</Label>
                        <div className="flex gap-2">
                            <Input {...register("barcode")} placeholder="Ex: LIB-2026-0001" className="flex-1" />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => setValue("barcode", `LIB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`, { shouldValidate: true })}
                            >
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>
                        {errors.barcode && <p className="text-xs text-destructive">{errors.barcode.message as string}</p>}
                    </div>

                    {/* État et Statut */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>État physique</Label>
                            <Controller
                                control={control}
                                name="condition"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent position="popper" sideOffset={4} className="w-(--radix-select-trigger-width)">
                                            <SelectItem value="New">Neuf</SelectItem>
                                            <SelectItem value="Good">Bon état</SelectItem>
                                            <SelectItem value="Worn">Usé</SelectItem>
                                            <SelectItem value="Damaged">Abîmé</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Statut</Label>
                            <Controller
                                control={control}
                                name="status"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent position="popper" sideOffset={4} className="w-(--radix-select-trigger-width)">
                                            <SelectItem value="Available">Disponible</SelectItem>
                                            <SelectItem value="Maintenance">Maintenance</SelectItem>
                                            <SelectItem value="Lost">Perdu</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>

                    {/* Emplacement */}
                    <div className="space-y-2">
                        <Label>Emplacement (Rayon/Salle)</Label>
                        <Controller
                            control={control}
                            name="location"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Choisir un emplacement" />
                                    </SelectTrigger>
                                    <SelectContent position="popper" sideOffset={4} className="w-(--radix-select-trigger-width)">
                                        {locations.map((l: any) => (
                                            <SelectItem key={l._id} value={l._id}>
                                                {l.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.location && <p className="text-xs text-destructive">{errors.location.message as string}</p>}
                    </div>

                    <DialogFooter className="pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
                        <Button type="submit" disabled={isPending}>{isPending ? "Enregistrement..." : (isEditing ? "Mettre à jour" : "Sauvegarder")}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}