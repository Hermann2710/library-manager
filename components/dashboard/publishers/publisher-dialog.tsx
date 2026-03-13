"use client"

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { publisherSchema, PublisherFormValues } from "@/lib/validation/publisher";
import { createPublisher, updatePublisher } from "@/actions/publisher-actions";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export function PublisherDialog({ isOpen, onOpenChange, publisher }: any) {
    const queryClient = useQueryClient();
    const isEditing = !!publisher;

    const { register, handleSubmit, reset, formState: { errors } } = useForm<PublisherFormValues>({
        resolver: zodResolver(publisherSchema as any),
    });

    useEffect(() => {
        if (publisher) reset(publisher);
        else reset({ name: "", address: "", website: "", email: "" });
    }, [publisher, reset, isOpen]);

    const { mutate, isPending } = useMutation({
        mutationFn: (data: PublisherFormValues) =>
            isEditing ? updatePublisher(publisher._id, data) : createPublisher(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["publishers"] });
            toast.success(isEditing ? "Éditeur mis à jour" : "Nouvel éditeur enregistré");
            onOpenChange(false);
        },
    });

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-125">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Modifier l'éditeur" : "Ajouter un éditeur"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nom de la maison d'édition</Label>
                        <Input id="name" {...register("name")} placeholder="ex: Eyrolles, Dunod..." />
                        {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email contact</Label>
                            <Input id="email" {...register("email")} placeholder="contact@editeur.com" />
                            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="website">Site Web</Label>
                            <Input id="website" {...register("website")} placeholder="https://..." />
                            {errors.website && <p className="text-xs text-destructive">{errors.website.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Adresse physique</Label>
                        <Input id="address" {...register("address")} placeholder="123 rue de l'Édition, Paris" />
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}