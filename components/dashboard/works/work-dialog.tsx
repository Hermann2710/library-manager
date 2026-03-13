"use client"

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { workSchema } from "@/lib/validation/work";
import { createWork, updateWork } from "@/actions/work-actions";
import { getAuthors } from "@/actions/author-actions";
import { getPublishers } from "@/actions/publisher-actions";
import { getCategories, getGenres } from "@/actions/taxonomy-actions";
import { toast } from "sonner";
import { ImageUpload } from "@/components/shared/image-upload";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

export function WorkDialog({ isOpen, onOpenChange, work }: any) {
    const queryClient = useQueryClient();
    const isEditing = !!work;

    const { data: authors = [] } = useQuery({ queryKey: ["authors"], queryFn: () => getAuthors() });
    const { data: publishers = [] } = useQuery({ queryKey: ["publishers"], queryFn: () => getPublishers() });
    const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: () => getCategories() });
    const { data: genres = [] } = useQuery({ queryKey: ["genres"], queryFn: () => getGenres() });

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
        resolver: zodResolver(workSchema as any),
        defaultValues: { title: "", language: "Anglais", authors: [], genres: [], description: "", coverImage: "" }
    });

    useEffect(() => {
        if (work) {
            reset({
                ...work,
                publisher: work.publisher?._id || work.publisher,
                category: work.category?._id || work.category,
                authors: work.authors?.map((a: any) => a._id || a) || [],
                genres: work.genres?.map((g: any) => g._id || g) || [],
                publishDate: work.publishDate ? new Date(work.publishDate).toISOString().split('T')[0] : ""
            });
        } else {
            reset({ title: "", language: "Anglais", authors: [], genres: [], description: "", coverImage: "" });
        }
    }, [work, reset, isOpen]);

    const { mutate, isPending } = useMutation({
        mutationFn: (data: any) => isEditing ? updateWork(work._id, data) : createWork(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["works"] });
            toast.success(isEditing ? "Mis à jour" : "Ajouté");
            onOpenChange(false);
        }
    });

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-3xl max-h-[95vh]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Modifier l'œuvre" : "Nouvel ouvrage"}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
                    <ScrollArea className="h-[75vh] pr-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {/* Colonne Gauche: Image */}
                            <div className="md:col-span-1 space-y-2">
                                <Label>Couverture</Label>
                                <Controller
                                    control={control}
                                    name="coverImage"
                                    render={({ field }) => (
                                        <ImageUpload
                                            value={field.value}
                                            onChange={field.onChange}
                                            onRemove={() => field.onChange("")}
                                        />
                                    )}
                                />
                            </div>

                            {/* Colonne Droite: Infos */}
                            <div className="md:col-span-3 space-y-4">
                                <div className="space-y-2">
                                    <Label>Titre</Label>
                                    <Input {...register("title")} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>ISBN</Label>
                                        <Input {...register("isbn")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Date de parution</Label>
                                        <Input type="date" {...register("publishDate")} />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Résumé</Label>
                                    <Textarea {...register("description")} className="h-24" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Langue</Label>
                                        <Input {...register("language")} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Éditeur</Label>
                                        <select {...register("publisher")} className="w-full h-10 border rounded-md px-3 text-sm">
                                            <option value="">Sélectionner...</option>
                                            {publishers.map((p: any) => <option key={p._id} value={p._id}>{p.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <div className="space-y-2">
                                <Label>Catégorie</Label>
                                <select {...register("category")} className="w-full h-10 border rounded-md px-3 text-sm">
                                    {categories.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label>Auteurs (Ctrl+Clic)</Label>
                                <select multiple {...register("authors")} className="w-full min-h-25 border rounded-md p-2 text-sm">
                                    {authors.map((a: any) => <option key={a._id} value={a._id}>{a.firstName} {a.lastName}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2 mt-4">
                            <Label>Genres (Ctrl+Clic)</Label>
                            <select multiple {...register("genres")} className="w-full min-h-20 border rounded-md p-2 text-sm">
                                {genres.map((g: any) => <option key={g._id} value={g._id}>{g.name}</option>)}
                            </select>
                        </div>
                    </ScrollArea>

                    <DialogFooter className="border-t pt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
                        <Button type="submit" disabled={isPending}>Enregistrer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}