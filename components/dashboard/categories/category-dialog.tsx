"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { categorySchema } from "@/lib/validation/taxonomy"
import { createCategory, updateCategory } from "@/actions/taxonomy-actions"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function CategoryDialog({ isOpen, onOpenChange, category }: any) {
    const queryClient = useQueryClient()
    const isEditing = !!category

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(categorySchema as any)
    })

    useEffect(() => {
        if (category) reset(category)
        else reset({ name: "", description: "" })
    }, [category, reset, isOpen])

    const { mutate, isPending } = useMutation({
        mutationFn: (data) => isEditing ? updateCategory(category._id, data) : createCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            toast.success(isEditing ? "Mis à jour" : "Créé")
            onOpenChange(false)
        }
    })

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader><DialogTitle>{isEditing ? "Modifier" : "Nouvelle"} Catégorie</DialogTitle></DialogHeader>
                <form onSubmit={handleSubmit((d: any) => mutate(d))} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Nom</Label>
                        <Input {...register("name")} placeholder="Informatique, Histoire..." />
                        {errors.name && <p className="text-xs text-destructive">{errors.name.message as string}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea {...register("description")} placeholder="Optionnel..." />
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>{isPending ? "Envoi..." : "Enregistrer"}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}