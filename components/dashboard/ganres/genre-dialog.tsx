"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { genreSchema } from "@/lib/validation/taxonomy"
import { createGenre, updateGenre } from "@/actions/taxonomy-actions"
import { toast } from "sonner"
import { Library, Sparkles, Loader2, PenTool } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

/**
 * GenreDialog Component:
 * Managed interface for artistic taxonomy.
 * Handles the registration of literary forms (e.g., Manga, Novel, Essay).
 */
export function GenreDialog({ isOpen, onOpenChange, genre }: any) {
    const queryClient = useQueryClient()
    const isEditing = !!genre

    // Form setup with schema validation for structural consistency
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(genreSchema as any)
    })

    /**
     * State Hydration:
     * Synchronizes form data with the active genre or performs a clean reset.
     */
    useEffect(() => {
        if (genre && isOpen) {
            reset({ name: genre.name })
        } else if (!isOpen) {
            reset({ name: "" })
        }
    }, [genre, reset, isOpen])

    // Mutation logic for cloud synchronization
    const { mutate, isPending } = useMutation({
        mutationFn: (data: any) => isEditing ? updateGenre(genre._id, data) : createGenre(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["genres"] })
            toast.success(isEditing ? "Registre des styles mis à jour" : "Nouveau genre littéraire enregistré")
            onOpenChange(false)
        },
        onError: (err: any) => {
            toast.error(err.message || "Erreur de classification artistique")
        }
    })

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md rounded-[3rem] border-border/40 p-8 shadow-2xl overflow-hidden">

                {/* Visual Identity Header */}
                <DialogHeader className="flex flex-row items-center gap-4 mb-6">
                    <div className="bg-primary/10 p-3 rounded-2xl border border-primary/20">
                        <Library className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">
                            {isEditing ? "Éditer le Genre" : "Nouveau Style"}
                        </DialogTitle>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                            Identité Littéraire
                        </p>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit((d: any) => mutate(d))} className="space-y-8">

                    {/* Main Input Section */}
                    <div className="space-y-3 p-6 bg-muted/20 rounded-[2rem] border border-border/40">
                        <Label
                            htmlFor="genre-name"
                            className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2"
                        >
                            <PenTool className="h-3 w-3" /> Désignation du genre
                        </Label>
                        <Input
                            id="genre-name"
                            {...register("name")}
                            placeholder="ex: Science-Fiction, Manga, Thriller..."
                            className="rounded-xl h-12 bg-background/50 border-border/60 focus:ring-primary/20 font-bold tracking-tight uppercase"
                        />
                        {errors.name && (
                            <p className="text-[10px] font-bold text-destructive px-1 italic animate-in fade-in slide-in-from-top-1">
                                {errors.name.message as string}
                            </p>
                        )}
                    </div>

                    {/* Taxonomy Context Message */}
                    <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl border border-dashed border-primary/20">
                        <Sparkles className="h-4 w-4 text-primary/60" />
                        <p className="text-[9px] text-muted-foreground leading-relaxed font-medium uppercase tracking-[0.05em]">
                            Le genre définit la **forme artistique**. Il est indépendant de la thématique d'étude.
                        </p>
                    </div>

                    <DialogFooter className="pt-2 gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="rounded-xl font-bold uppercase text-[10px] tracking-widest"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="rounded-2xl h-12 px-8 font-black uppercase text-[10px] tracking-[0.2em] italic shadow-lg shadow-primary/20 min-w-40"
                        >
                            {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Sauvegarder"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}