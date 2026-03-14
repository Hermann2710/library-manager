"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { categorySchema } from "@/lib/validation/taxonomy"
import { createCategory, updateCategory } from "@/actions/taxonomy-actions"
import { toast } from "sonner"
import { Bookmark, AlignLeft, Loader2, ShieldPlus } from "lucide-react"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

/**
 * CategoryDialog:
 * Specialized interface for structural taxonomy.
 * Manages the creation and updates of thematic categories used for book filtering.
 */
export function CategoryDialog({ isOpen, onOpenChange, category }: any) {
    const queryClient = useQueryClient()
    const isEditing = !!category

    // Form setup with schema validation for taxonomy integrity
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(categorySchema as any)
    })

    /**
     * Data Hydration:
     * Synchronizes form state with the active category or resets for new entries.
     */
    useEffect(() => {
        if (category && isOpen) {
            reset({
                name: category.name,
                description: category.description || ""
            })
        } else if (!isOpen) {
            reset({ name: "", description: "" })
        }
    }, [category, reset, isOpen])

    // Mutation logic for database synchronization
    const { mutate, isPending } = useMutation({
        mutationFn: (data: any) => isEditing ? updateCategory(category._id, data) : createCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            toast.success(isEditing ? "Index thématique mis à jour" : "Nouvelle catégorie enregistrée")
            onOpenChange(false)
        },
        onError: (err: any) => toast.error(err.message || "Erreur de classification")
    })

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md rounded-[3rem] border-border/40 p-8 shadow-2xl">
                <DialogHeader className="flex flex-row items-center gap-4 mb-6">
                    <div className="bg-primary/10 p-3 rounded-2xl border border-primary/20">
                        <Bookmark className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter">
                            {isEditing ? "Éditer la Thématique" : "Nouveau Sujet"}
                        </DialogTitle>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                            Classification Catalogue
                        </p>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit((d: any) => mutate(d))} className="space-y-6">

                    {/* SECTION: Thematic Name */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                            <ShieldPlus className="h-3 w-3" /> Nom de la catégorie
                        </Label>
                        <Input
                            {...register("name")}
                            placeholder="ex: Informatique, Droit, Médecine..."
                            className="rounded-xl h-11 bg-muted/20 border-border/40 focus:ring-primary/20 font-bold tracking-tight"
                        />
                        {errors.name && (
                            <p className="text-[10px] font-bold text-destructive px-1 italic">
                                {errors.name.message as string}
                            </p>
                        )}
                    </div>

                    {/* SECTION: Scope Description */}
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                            <AlignLeft className="h-3 w-3" /> Description (Périmètre)
                        </Label>
                        <Textarea
                            {...register("description")}
                            placeholder="Précisez le champ d'application de cette thématique..."
                            className="min-h-25 rounded-2xl bg-muted/20 border-border/40 focus:ring-primary/20 resize-none text-sm p-4 italic"
                        />
                    </div>

                    {/* DECORATIVE CONTEXT BOX */}
                    <div className="p-4 bg-primary/5 rounded-2xl border border-dashed border-primary/20">
                        <p className="text-[9px] text-muted-foreground leading-relaxed font-medium">
                            Les catégories aident les lecteurs à naviguer par **Sujet d'étude**. Soyez précis pour optimiser la recherche globale.
                        </p>
                    </div>

                    <DialogFooter className="pt-4 gap-3">
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
                                "Enregistrer"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}