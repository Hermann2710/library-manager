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
import { Book, Hash, Layers, Loader2, Users, Quote, Globe2, Calendar, Library } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export function WorkDialog({ isOpen, onOpenChange, work }: any) {
    const queryClient = useQueryClient();
    const isEditing = !!work;

    const { data: authors = [] } = useQuery({ queryKey: ["authors"], queryFn: () => getAuthors() });
    const { data: publishers = [] } = useQuery({ queryKey: ["publishers"], queryFn: () => getPublishers() });
    const { data: categories = [] } = useQuery({ queryKey: ["categories"], queryFn: () => getCategories() });
    const { data: genres = [] } = useQuery({ queryKey: ["genres"], queryFn: () => getGenres() });

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
        resolver: zodResolver(workSchema as any),
        defaultValues: { title: "", language: "Français", authors: [], genres: [], description: "", coverImage: "", publisher: "", category: "" }
    });

    useEffect(() => {
        if (work && isOpen) {
            reset({
                ...work,
                publisher: work.publisher?._id || work.publisher,
                category: work.category?._id || work.category,
                authors: work.authors?.map((a: any) => a._id || a) || [],
                genres: work.genres?.map((g: any) => g._id || g) || [],
                publishDate: work.publishDate ? new Date(work.publishDate).toISOString().split('T')[0] : ""
            });
        } else if (!isOpen) {
            reset({ title: "", language: "Français", authors: [], genres: [], description: "", coverImage: "", publisher: "", category: "" });
        }
    }, [work, reset, isOpen]);

    const { mutate, isPending } = useMutation({
        mutationFn: (data: any) => isEditing ? updateWork(work._id, data) : createWork(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["works"] });
            toast.success("Mise à jour du catalogue effectuée");
            onOpenChange(false);
        }
    });

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-none w-250! h-[85vh] p-0 overflow-hidden border-none bg-background shadow-2xl flex flex-col">

                {/* HEADER */}
                <div className="h-20 border-b px-10 flex items-center shrink-0 bg-card z-20">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Book className="h-5 w-5 text-primary" />
                        </div>
                        <DialogTitle className="text-xl font-black uppercase italic tracking-tighter">
                            {isEditing ? "Édition de l'ouvrage" : "Nouveau Catalogue"}
                        </DialogTitle>
                    </div>
                </div>

                {/* SCROLLABLE BODY */}
                <div className="flex-1 overflow-y-auto bg-muted/5 custom-scrollbar">
                    <form id="work-form" onSubmit={handleSubmit((d) => mutate(d))} className="p-10 space-y-12">
                        <div className="grid grid-cols-12 gap-10">

                            {/* MEDIA COLUMN */}
                            <div className="col-span-4 space-y-6">
                                <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Visuel de couverture</Label>
                                <Controller
                                    control={control}
                                    name="coverImage"
                                    render={({ field }) => (
                                        <div className="rounded-[2.5rem] overflow-hidden border-2 border-dashed border-border/40 p-2 bg-background shadow-sm">
                                            <ImageUpload value={field.value} onChange={field.onChange} onRemove={() => field.onChange("")} />
                                        </div>
                                    )}
                                />
                                <div className="p-5 bg-primary/5 rounded-2xl border border-primary/10 space-y-4">
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-black uppercase flex items-center gap-2"><Globe2 className="h-3 w-3" /> Langue</Label>
                                        <Input {...register("language")} className="h-10 rounded-xl" />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-[10px] font-black uppercase flex items-center gap-2"><Calendar className="h-3 w-3" /> Parution</Label>
                                        <Input type="date" {...register("publishDate")} className="h-10 rounded-xl font-mono" />
                                    </div>
                                </div>
                            </div>

                            {/* MAIN INFO COLUMN */}
                            <div className="col-span-8 space-y-8">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Titre de l'œuvre</Label>
                                    <Input {...register("title")} className="h-14 rounded-2xl bg-muted/20 font-black uppercase italic text-lg px-6 border-border/40" />
                                    {errors.title && <p className="text-[10px] font-bold text-destructive italic">{errors.title.message as string}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Hash className="h-3 w-3" /> ISBN</Label>
                                        <Input {...register("isbn")} className="rounded-xl h-11 font-mono" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2"><Library className="h-3 w-3" /> Éditeur</Label>
                                        <Controller
                                            control={control}
                                            name="publisher"
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    {/* w-full ici pour prendre toute la largeur de la colonne */}
                                                    <SelectTrigger className="w-full h-11 rounded-xl bg-muted/20 border-border/40 font-bold uppercase italic text-[11px] px-4">
                                                        <SelectValue placeholder="Choisir l'éditeur..." />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-xl shadow-2xl z-100">
                                                        {publishers.map((p: any) => (
                                                            <SelectItem key={p._id} value={p._id} className="font-bold uppercase italic text-[11px]">{p.name}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ml-1"><Quote className="h-3 w-3" /> Résumé analytique</Label>
                                    <Textarea {...register("description")} className="h-40 rounded-[2rem] bg-muted/10 border-border/40 p-6 text-sm italic resize-none leading-relaxed" />
                                </div>
                            </div>
                        </div>

                        {/* TAXONOMY SECTION */}
                        <div className="grid grid-cols-2 gap-10 p-8 bg-muted/20 rounded-[3rem] border border-border/40 shadow-inner">
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black uppercase flex items-center gap-2 ml-1"><Users className="h-4 w-4 text-primary" /> Auteurs principaux</Label>
                                <select multiple {...register("authors")} className="w-full h-48 bg-background border border-border/40 rounded-[1.5rem] p-4 text-[11px] font-bold uppercase scrollbar-hide focus:ring-2 ring-primary/20 outline-none">
                                    {authors.map((a: any) => <option key={a._id} value={a._id} className="p-2 mb-1 rounded-xl hover:bg-primary/10 transition-colors">{a.firstName} {a.lastName}</option>)}
                                </select>
                                <p className="text-[9px] text-muted-foreground italic font-black uppercase tracking-[0.2em] ml-2 opacity-50">Maintenir CTRL pour plusieurs</p>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase flex items-center gap-2 ml-1"><Layers className="h-4 w-4 text-primary" /> Classification</Label>
                                    <Controller
                                        control={control}
                                        name="category"
                                        render={({ field }) => (
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="w-full h-12 rounded-xl bg-background border-border/40 font-black uppercase italic text-[11px] px-4">
                                                    <SelectValue placeholder="Catégorie..." />
                                                </SelectTrigger>
                                                <SelectContent className="rounded-xl shadow-2xl z-100">
                                                    {categories.map((c: any) => (
                                                        <SelectItem key={c._id} value={c._id} className="font-bold uppercase italic text-[11px]">{c.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase ml-1">Genres associés</Label>
                                    <select multiple {...register("genres")} className="w-full h-28 bg-background border border-border/40 rounded-[1.5rem] p-4 text-[11px] font-bold uppercase scrollbar-hide">
                                        {genres.map((g: any) => <option key={g._id} value={g._id} className="p-2 mb-1 rounded-xl">{g.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* FOOTER */}
                <div className="h-20 border-t px-10 flex items-center justify-end gap-5 shrink-0 bg-card z-20">
                    <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold uppercase text-[10px] tracking-[0.3em] px-8 h-12">
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        form="work-form"
                        disabled={isPending}
                        className="rounded-[1.5rem] h-12 px-12 font-black uppercase text-[10px] tracking-[0.2em] italic shadow-xl shadow-primary/20 min-w-60"
                    >
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Sauvegarder l'entrée"}
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    );
}