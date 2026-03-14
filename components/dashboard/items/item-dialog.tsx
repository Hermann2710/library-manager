"use client"

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { itemSchema } from "@/lib/validation/item";
import { createItem, updateItem } from "@/actions/item-actions";
import { getWorks } from "@/actions/work-actions";
import { getLocations } from "@/actions/location-actions";
import { toast } from "sonner";
import { RefreshCw, Barcode, MapPin, Activity, PackageCheck, Loader2 } from "lucide-react";

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
import { cn } from "@/lib/utils";

/**
 * ItemDialog Component:
 * Handles the lifecycle of a physical book unit (Item).
 * Manages relationships with the 'Work' collection and physical 'Location' entities.
 */
export function ItemDialog({ isOpen, onOpenChange, item }: any) {
    const queryClient = useQueryClient();
    const isEditing = !!item;

    // Prefetching relational data for the select inputs
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

    /**
     * Form Synchronization:
     * When editing, we extract the IDs from populated objects to match Select values.
     */
    useEffect(() => {
        if (item && isOpen) {
            reset({
                ...item,
                work: item.work?._id || item.work,
                location: item.location?._id || item.location,
                status: item.status,
                condition: item.condition,
                barcode: item.barcode
            });
        } else if (!isOpen) {
            reset({ status: "Available", condition: "Good", barcode: "", work: "", location: "" });
        }
    }, [item, reset, isOpen]);

    const { mutate, isPending } = useMutation({
        mutationFn: (data: any) => isEditing ? updateItem(item._id, data) : createItem(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["items"] });
            toast.success(isEditing ? "Exemplaire synchronisé" : "Unité ajoutée à l'inventaire");
            onOpenChange(false);
        },
        onError: (err: any) => toast.error(err.message || "Erreur d'enregistrement")
    });

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl rounded-[3rem] border-border/40 p-8 shadow-2xl">
                <DialogHeader className="flex flex-row items-center gap-4 mb-6">
                    <div className="bg-primary/10 p-3 rounded-2xl border border-primary/20">
                        <Barcode className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">
                            {isEditing ? "Gérer l'exemplaire" : "Nouvelle Unité"}
                        </DialogTitle>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                            Gestion d'inventaire physique
                        </p>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-6">

                    {/* SECTION: Relation Œuvre */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                            <PackageCheck className="h-3 w-3" /> Œuvre correspondante
                        </Label>
                        <Controller
                            control={control}
                            name="work"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <SelectTrigger className="rounded-xl h-11 border-border/60">
                                        <SelectValue placeholder="Sélectionner un titre du catalogue" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-border/40 shadow-xl">
                                        {works.length > 0 ? works.map((w: any) => (
                                            <SelectItem key={w._id} value={w._id} className="rounded-lg py-2.5 font-bold italic text-xs">
                                                {w.title}
                                            </SelectItem>
                                        )) : <SelectItem value="none" disabled>Aucun titre disponible</SelectItem>}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.work && <p className="text-[10px] font-bold text-destructive italic">{errors.work.message as string}</p>}
                    </div>

                    {/* SECTION: Identification Unique */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Code-barres Identifiant</Label>
                        <div className="flex gap-2">
                            <Input
                                {...register("barcode")}
                                placeholder="Ex: LIB-2026-0001"
                                className="rounded-xl h-11 border-border/60 font-mono text-sm"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-11 w-11 rounded-xl border-border/60 hover:bg-primary/5 hover:text-primary transition-all"
                                onClick={() => setValue("barcode", `LIB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`, { shouldValidate: true })}
                            >
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </div>
                        {errors.barcode && <p className="text-[10px] font-bold text-destructive italic">{errors.barcode.message as string}</p>}
                    </div>

                    {/* SECTION: État et Statut (Grille) */}
                    <div className="grid grid-cols-2 gap-6 p-6 bg-muted/20 rounded-[2rem] border border-border/40 relative overflow-hidden">
                        <div className="space-y-2 relative">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
                                <Activity className="h-3 w-3" /> État physique
                            </Label>
                            <Controller
                                control={control}
                                name="condition"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="rounded-xl h-10 bg-background/50 border-border/40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-border/40 shadow-lg">
                                            <SelectItem value="New" className="text-xs font-bold italic">Neuf</SelectItem>
                                            <SelectItem value="Good" className="text-xs font-bold italic">Bon état</SelectItem>
                                            <SelectItem value="Worn" className="text-xs font-bold italic text-amber-600">Usé</SelectItem>
                                            <SelectItem value="Damaged" className="text-xs font-bold italic text-rose-600">Abîmé</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="space-y-2 relative">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80 flex items-center gap-2">
                                <Activity className="h-3 w-3" /> Statut
                            </Label>
                            <Controller
                                control={control}
                                name="status"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="rounded-xl h-10 bg-background/50 border-border/40">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-border/40 shadow-lg">
                                            <SelectItem value="Available" className="text-xs font-bold italic text-emerald-600">Disponible</SelectItem>
                                            <SelectItem value="Maintenance" className="text-xs font-bold italic text-amber-600">Maintenance</SelectItem>
                                            <SelectItem value="Lost" className="text-xs font-bold italic text-rose-600">Perdu</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                    </div>

                    {/* SECTION: Localisation */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                            <MapPin className="h-3 w-3" /> Emplacement (Rayon/Salle)
                        </Label>
                        <Controller
                            control={control}
                            name="location"
                            render={({ field }) => (
                                <Select onValueChange={field.onChange} value={field.value || ""}>
                                    <SelectTrigger className="rounded-xl h-11 border-border/60">
                                        <SelectValue placeholder="Attribuer un emplacement physique" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-border/40 shadow-xl">
                                        {locations.length > 0 ? locations.map((l: any) => (
                                            <SelectItem key={l._id} value={l._id} className="rounded-lg py-2.5 font-bold italic text-xs">
                                                {l.name}
                                            </SelectItem>
                                        )) : <SelectItem value="none" disabled>Aucun emplacement défini</SelectItem>}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.location && <p className="text-[10px] font-bold text-destructive italic">{errors.location.message as string}</p>}
                    </div>

                    <DialogFooter className="pt-6 gap-3">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold uppercase text-[10px] tracking-widest">
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="rounded-2xl h-12 px-8 font-black uppercase text-[10px] tracking-[0.2em] italic shadow-lg shadow-primary/20 min-w-40"
                        >
                            {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : isEditing ? (
                                "Mettre à jour"
                            ) : (
                                "Sauvegarder l'unité"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}