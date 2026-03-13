"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { genreSchema } from "@/lib/validation/taxonomy"
import { createGenre, updateGenre } from "@/actions/taxonomy-actions"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function GenreDialog({ isOpen, onOpenChange, genre }: any) {
    const queryClient = useQueryClient()
    const isEditing = !!genre

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: zodResolver(genreSchema as any)
    })

    useEffect(() => {
        if (genre) reset(genre)
        else reset({ name: "" })
    }, [genre, reset, isOpen])

    const { mutate, isPending } = useMutation({
        mutationFn: (data) => isEditing ? updateGenre(genre._id, data) : createGenre(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["genres"] })
            toast.success(isEditing ? "Genre mis à jour" : "Genre créé")
            onOpenChange(false)
        },
        onError: () => toast.error("Une erreur est survenue")
    })

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>{isEditing ? "Modifier le genre" : "Nouveau genre"}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit((d: any) => mutate(d))} className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="genre-name">Nom du genre</Label>
                        <Input
                            id="genre-name"
                            {...register("name")}
                            placeholder="ex: Science-Fiction, Thriller, Manga..."
                        />
                        {errors.name && <p className="text-xs text-destructive font-medium">{errors.name.message as string}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                            Annuler
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Enregistrement..." : "Enregistrer"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}