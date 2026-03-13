"use client"

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authorSchema } from "@/lib/validation/author";
import { createAuthor, updateAuthor } from "@/actions/author-actions";
import { toast } from "sonner";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

type AuthorFormValues = z.infer<typeof authorSchema>;

interface AuthorDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    author?: any;
}

export function AuthorDialog({ isOpen, onOpenChange, author }: AuthorDialogProps) {
    const queryClient = useQueryClient();
    const isEditing = !!author;

    const { register, handleSubmit, reset, formState: { errors } } = useForm<AuthorFormValues>({
        resolver: zodResolver(authorSchema as any),
        defaultValues: {
            firstName: "",
            lastName: "",
            bio: "",
            nationality: "",
            birthDate: undefined,
            deathDate: undefined
        },
    });

    useEffect(() => {
        if (author) {
            reset({
                firstName: author.firstName,
                lastName: author.lastName,
                bio: author.bio || "",
                nationality: author.nationality || "",
                // Formatage YYYY-MM-DD pour les inputs HTML date
                birthDate: author.birthDate ? new Date(author.birthDate).toISOString().split('T')[0] as any : undefined,
                deathDate: author.deathDate ? new Date(author.deathDate).toISOString().split('T')[0] as any : undefined,
            });
        } else {
            reset({ firstName: "", lastName: "", bio: "", nationality: "", birthDate: undefined, deathDate: undefined });
        }
    }, [author, reset, isOpen]);

    const { mutate, isPending } = useMutation({
        mutationFn: (values: AuthorFormValues) =>
            isEditing ? updateAuthor(author._id, values) : createAuthor(values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authors"] });
            toast.success(isEditing ? "Auteur mis à jour" : "Auteur ajouté avec succès");
            onOpenChange(false);
        },
        onError: () => toast.error("Erreur lors de l'enregistrement"),
    });

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-150">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">
                        {isEditing ? "Modifier l'auteur" : "Nouvel auteur"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-5 py-4">
                    {/* Identité */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Prénom</Label>
                            <Input id="firstName" placeholder="Victor" {...register("firstName")} />
                            {errors.firstName && <p className="text-sm text-destructive">{errors.firstName.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Nom</Label>
                            <Input id="lastName" placeholder="Hugo" {...register("lastName")} />
                            {errors.lastName && <p className="text-sm text-destructive">{errors.lastName.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nationality">Nationalité</Label>
                        <Input id="nationality" placeholder="Française" {...register("nationality")} />
                        {errors.nationality && <p className="text-sm text-destructive">{errors.nationality.message}</p>}
                    </div>

                    {/* Dates chronologiques */}
                    <div className="grid grid-cols-2 gap-4 border-y py-4 bg-muted/30 px-2 rounded-lg">
                        <div className="space-y-2">
                            <Label htmlFor="birthDate">Date de naissance</Label>
                            <Input id="birthDate" type="date" {...register("birthDate")} />
                            {errors.birthDate && <p className="text-sm text-destructive">{errors.birthDate.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deathDate">Date de décès</Label>
                            <Input id="deathDate" type="date" {...register("deathDate")} />
                            {errors.deathDate && <p className="text-sm text-destructive">{errors.deathDate.message}</p>}
                        </div>
                    </div>

                    {/* Biographie */}
                    <div className="space-y-2">
                        <Label htmlFor="bio">Biographie</Label>
                        <Textarea
                            id="bio"
                            placeholder="Courte description..."
                            className="min-h-25 resize-none"
                            {...register("bio")}
                        />
                        {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Enregistrement..." : isEditing ? "Sauvegarder" : "Créer l'auteur"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}