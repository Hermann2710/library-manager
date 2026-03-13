"use client"

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { workSchema } from "@/lib/validation/work";
import { createWork, updateWork } from "@/actions/work-actions";
import { getAuthors } from "@/actions/author-actions";
import { getPublishers } from "@/actions/publisher-actions";
import { getCategories, getGenres } from "@/actions/taxonomy-actions";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

export function WorkDialog({ isOpen, onOpenChange, work }: any) {
    const queryClient = useQueryClient();
    const isEditing = !!work;

    // Récupération de TOUTES les données de référence
    const { data: authors = [] } = useQuery({ queryKey: ["authors"], queryFn: () => getAuthors() });
    const { data: publishers = [] } = useQuery({ queryKey: ["publishers"], queryFn: () => getPublishers() });
    const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: () => getCategories() });
    const { data: genres = [] } = useQuery({ queryKey: ["genres"], queryFn: () => getGenres() });

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(workSchema as any),
        defaultValues: { title: "", language: "Anglais", authors: [], genres: [] }
    });

    useEffect(() => {
        if (work) {
            reset({
                ...work,
                publisher: work.publisher?._id || work.publisher,
                category: work.category?._id || work.category,
                authors: work.authors?.map((a: any) => a._id || a) || [],
                genres: work.genres?.map((g: any) => g._id || g) || [],
                publishDate: work.publishDate ? new Date(work.publishDate).toISOString().split('T')[0] : undefined
            });
        } else {
            reset({ title: "", language: "Anglais", authors: [], genres: [] });
        }
    }, [work, reset, isOpen]);

    const { mutate, isPending } = useMutation({
        mutationFn: (data: any) => isEditing ? updateWork(work._id, data) : createWork(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["works"] });
            toast.success(isEditing ? "Ouvrage mis à jour" : "Ouvrage ajouté au catalogue");
            onOpenChange(false);
        },
        onError: (err: any) => toast.error(err.message)
    });

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-175 max-h-[90vh]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Modifier l'œuvre" : "Nouvel ouvrage"}</DialogTitle>
                    <DialogDescription>Renseignez les informations bibliographiques de l'ouvrage.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4 py-2">
                    <ScrollArea className="h-[60vh] pr-4">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Titre de l'ouvrage</Label>
                                <Input {...register("title")} placeholder="ex: Les Misérables" />
                                {errors.title && <p className="text-xs text-destructive">{errors.title.message as string}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>ISBN</Label>
                                    <Input {...register("isbn")} placeholder="978-..." />
                                </div>
                                <div className="space-y-2">
                                    <Label>Langue</Label>
                                    <Input {...register("language")} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Éditeur</Label>
                                    <select {...register("publisher")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring">
                                        <option value="">Sélectionner...</option>
                                        {publishers.map((p: any) => <option key={p._id} value={p._id}>{p.name}</option>)}
                                    </select>
                                    {errors.publisher && <p className="text-xs text-destructive">{errors.publisher.message as string}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label>Catégorie</Label>
                                    <select {...register("category")} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                        <option value="">Sélectionner...</option>
                                        {categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Auteurs (Sélection multiple : Ctrl+Clic)</Label>
                                <select multiple {...register("authors")} className="flex min-h-25 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    {authors.map((a: any) => <option key={a._id} value={a._id}>{a.firstName} {a.lastName}</option>)}
                                </select>
                                {errors.authors && <p className="text-xs text-destructive">{errors.authors.message as string}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label>Genres (Sélection multiple : Ctrl+Clic)</Label>
                                <select multiple {...register("genres")} className="flex min-h-25 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                                    {genres.map((g: any) => <option key={g._id} value={g._id}>{g.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </ScrollArea>

                    <DialogFooter className="pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
                        <Button type="submit" disabled={isPending}>{isPending ? "Enregistrement..." : "Sauvegarder l'œuvre"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}