"use client"

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { publisherSchema, PublisherFormValues } from "@/lib/validation/publisher";
import { createPublisher, updatePublisher } from "@/actions/publisher-actions";
import { toast } from "sonner";
import { Landmark, Mail, Globe, MapPin, Loader2, ShieldCheck } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * PublisherDialog Component:
 * Managed form for publishing house entities.
 * Ensures data integrity for corporate partners within the library ecosystem.
 */
export function PublisherDialog({ isOpen, onOpenChange, publisher }: any) {
    const queryClient = useQueryClient();
    const isEditing = !!publisher;

    // Form initialization with strictly typed validation schema
    const { register, handleSubmit, reset, formState: { errors } } = useForm<PublisherFormValues>({
        resolver: zodResolver(publisherSchema as any),
    });

    /**
     * State Synchronization:
     * Resets form values when the dialog opens or when a different publisher is selected.
     */
    useEffect(() => {
        if (publisher && isOpen) {
            reset(publisher);
        } else if (!isOpen) {
            reset({ name: "", address: "", website: "", email: "" });
        }
    }, [publisher, reset, isOpen]);

    // Mutation logic with automated UI feedback
    const { mutate, isPending } = useMutation({
        mutationFn: (data: PublisherFormValues) =>
            isEditing ? updatePublisher(publisher._id, data) : createPublisher(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["publishers"] });
            toast.success(isEditing ? "Identité éditeur mise à jour" : "Nouveau partenaire enregistré");
            onOpenChange(false);
        },
        onError: (err: any) => {
            toast.error(err.message || "Erreur lors de la synchronisation");
        }
    });

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl rounded-[3rem] border-border/40 p-8 shadow-2xl overflow-hidden">
                {/* Visual Header with Brand Identity */}
                <DialogHeader className="flex flex-row items-center gap-4 mb-6">
                    <div className="bg-primary/10 p-4 rounded-2xl border border-primary/20">
                        <Landmark className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter leading-none">
                            {isEditing ? "Éditer l'Éditeur" : "Nouveau Partenaire"}
                        </DialogTitle>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/60 mt-1">
                            Base de données Corporate
                        </p>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-6">
                    {/* SECTION: Identity */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest ml-1">
                            Nom de la Maison d'Édition
                        </Label>
                        <Input
                            id="name"
                            {...register("name")}
                            placeholder="ex: Eyrolles, Dunod, O'Reilly..."
                            className="rounded-xl h-12 bg-muted/20 border-border/40 focus:ring-primary/20 text-sm font-bold uppercase tracking-tight"
                        />
                        {errors.name && <p className="text-[10px] font-bold text-destructive italic px-1">{errors.name.message}</p>}
                    </div>

                    {/* SECTION: Digital Contact */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-muted/20 rounded-[2rem] border border-border/40">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Mail className="h-3 w-3" /> Email Contact
                            </Label>
                            <Input
                                id="email"
                                {...register("email")}
                                placeholder="contact@editeur.com"
                                className="rounded-xl h-11 bg-background/50 border-border/60 text-xs font-medium"
                            />
                            {errors.email && <p className="text-[10px] font-bold text-destructive italic">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="website" className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Globe className="h-3 w-3" /> Site Officiel
                            </Label>
                            <Input
                                id="website"
                                {...register("website")}
                                placeholder="https://..."
                                className="rounded-xl h-11 bg-background/50 border-border/60 text-xs font-medium"
                            />
                        </div>
                    </div>

                    {/* SECTION: Physical Presence */}
                    <div className="space-y-2">
                        <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                            <MapPin className="h-3 w-3" /> Siège Social
                        </Label>
                        <Input
                            id="address"
                            {...register("address")}
                            placeholder="Akwa, Douala"
                            className="rounded-xl h-11 border-border/60 text-sm italic"
                        />
                    </div>

                    {/* COMPLIANCE HINT */}
                    <div className="flex items-center gap-3 p-4 bg-emerald-500/5 rounded-2xl border border-dashed border-emerald-500/20">
                        <ShieldCheck className="h-4 w-4 text-emerald-600/60" />
                        <p className="text-[9px] text-emerald-700/80 font-bold uppercase tracking-widest italic">
                            Les modifications seront répercutées sur tous les ouvrages associés.
                        </p>
                    </div>

                    <DialogFooter className="pt-4 gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="rounded-xl font-bold uppercase text-[10px] tracking-widest hover:bg-muted"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="rounded-2xl h-12 px-8 font-black uppercase text-[10px] tracking-[0.2em] italic shadow-lg shadow-primary/20 min-w-50"
                        >
                            {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Enregistrer le Partenaire"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
