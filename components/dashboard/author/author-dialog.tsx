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
import { Calendar, Quote, Globe, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthorFormValues = z.infer<typeof authorSchema>;

interface AuthorDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    author?: any;
}

/**
 * AuthorDialog: A specialized form for creating or updating author records.
 * It uses React Hook Form for validation and TanStack Mutation for data persistence.
 */
export function AuthorDialog({ isOpen, onOpenChange, author }: AuthorDialogProps) {
    const queryClient = useQueryClient();
    const isEditing = !!author;

    // Form Initialization with Zod validation
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

    /**
     * Effect Hook: Synchronizes the form state with the 'author' prop.
     * Formats ISO dates to 'YYYY-MM-DD' for native HTML date inputs.
     */
    useEffect(() => {
        if (author && isOpen) {
            reset({
                firstName: author.firstName,
                lastName: author.lastName,
                bio: author.bio || "",
                nationality: author.nationality || "",
                birthDate: author.birthDate ? new Date(author.birthDate).toISOString().split('T')[0] as any : undefined,
                deathDate: author.deathDate ? new Date(author.deathDate).toISOString().split('T')[0] as any : undefined,
            });
        } else if (!isOpen) {
            // No reset here to avoid flickering during close animation, 
            // handled when opening for a fresh record.
        }
    }, [author, reset, isOpen]);

    // Mutation Logic for Server-Side sync
    const { mutate, isPending } = useMutation({
        mutationFn: (values: AuthorFormValues) =>
            isEditing ? updateAuthor(author._id, values) : createAuthor(values),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authors"] });
            toast.success(isEditing ? "Notice biographique mise à jour" : "Auteur ajouté au référentiel");
            onOpenChange(false);
            reset();
        },
        onError: (err: any) => toast.error(err.message || "Échec de l'enregistrement"),
    });

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-150 rounded-[3rem] border-border/40 p-8 shadow-2xl overflow-hidden">
                <DialogHeader className="flex flex-row items-center gap-4 mb-6">
                    <div className="bg-primary/10 p-3 rounded-2xl border border-primary/20">
                        <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">
                            {isEditing ? "Modifier l'auteur" : "Nouvel auteur"}
                        </DialogTitle>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                            Catalogue Référentiel
                        </p>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit((data) => mutate(data))} className="space-y-6">
                    {/* SECTION: Identity */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-[10px] font-black uppercase tracking-widest ml-1">Prénom</Label>
                            <Input id="firstName" placeholder="Victor" {...register("firstName")} className="rounded-xl h-11 border-border/60 focus:ring-primary/20" />
                            {errors.firstName && <p className="text-[10px] font-bold text-destructive px-1 italic">{errors.firstName.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-[10px] font-black uppercase tracking-widest ml-1">Nom</Label>
                            <Input id="lastName" placeholder="Hugo" {...register("lastName")} className="rounded-xl h-11 border-border/60 focus:ring-primary/20" />
                            {errors.lastName && <p className="text-[10px] font-bold text-destructive px-1 italic">{errors.lastName.message}</p>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nationality" className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Globe className="h-3 w-3" /> Nationalité
                        </Label>
                        <Input id="nationality" placeholder="Ex: Française, Japonaise..." {...register("nationality")} className="rounded-xl h-11 border-border/60" />
                        {errors.nationality && <p className="text-[10px] font-bold text-destructive px-1 italic">{errors.nationality.message}</p>}
                    </div>

                    {/* SECTION: Chronology (Visual Highlight) */}
                    <div className="grid grid-cols-2 gap-6 p-6 bg-muted/20 rounded-[2rem] border border-border/40 shadow-inner relative overflow-hidden">
                        <Calendar className="absolute -right-4 -bottom-4 h-24 w-24 text-muted-foreground/5 opacity-10" />
                        <div className="space-y-2 relative">
                            <Label htmlFor="birthDate" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Naissance</Label>
                            <Input id="birthDate" type="date" {...register("birthDate")} className="rounded-xl bg-background/50" />
                            {errors.birthDate && <p className="text-[10px] font-bold text-destructive italic">{errors.birthDate.message}</p>}
                        </div>
                        <div className="space-y-2 relative">
                            <Label htmlFor="deathDate" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Décès (Optionnel)</Label>
                            <Input id="deathDate" type="date" {...register("deathDate")} className="rounded-xl bg-background/50" />
                            {errors.deathDate && <p className="text-[10px] font-bold text-destructive italic">{errors.deathDate.message}</p>}
                        </div>
                    </div>

                    {/* SECTION: Biography */}
                    <div className="space-y-2">
                        <Label htmlFor="bio" className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                            <Quote className="h-3 w-3" /> Biographie
                        </Label>
                        <Textarea
                            id="bio"
                            placeholder="Rédigez une courte notice biographique pour le catalogue..."
                            className="min-h-30 rounded-2xl border-border/60 focus:ring-primary/20 resize-none p-4 text-sm leading-relaxed"
                            {...register("bio")}
                        />
                        {errors.bio && <p className="text-[10px] font-bold text-destructive px-1 italic">{errors.bio.message}</p>}
                    </div>

                    <DialogFooter className="pt-4 gap-3 sm:gap-0">
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold uppercase text-[10px] tracking-widest">
                            Fermer
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="rounded-2xl h-12 px-8 font-black uppercase text-[10px] tracking-[0.2em] italic shadow-lg shadow-primary/20 min-w-40"
                        >
                            {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : isEditing ? (
                                "Sauvegarder"
                            ) : (
                                "Créer l'auteur"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}