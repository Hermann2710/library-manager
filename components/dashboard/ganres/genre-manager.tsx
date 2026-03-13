"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getGenres, deleteGenre } from "@/actions/taxonomy-actions"
import { DataTable } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash } from "lucide-react"
import { toast } from "sonner"
import { ColumnDef } from "@tanstack/react-table"
import { GenreDialog } from "./genre-dialog"

export function GenreManager() {
    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState<any>(null)
    const queryClient = useQueryClient()

    const { data = [], isLoading } = useQuery({
        queryKey: ["genres"],
        queryFn: () => getGenres()
    })

    const { mutate: remove } = useMutation({
        mutationFn: deleteGenre,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["genres"] })
            toast.success("Genre supprimé avec succès")
        },
        onError: () => toast.error("Impossible de supprimer ce genre")
    })

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Nom du genre",
            cell: ({ row }) => <span className="font-medium">{row.original.name}</span>
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => { setSelected(row.original); setIsOpen(true); }}>
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => remove(row.original._id)} className="text-destructive">
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
    ]

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Button onClick={() => { setSelected(null); setIsOpen(true); }}>
                    <Plus className="mr-2 h-4 w-4" /> Ajouter un genre
                </Button>
            </div>
            <DataTable columns={columns} data={data} loading={isLoading} />
            <GenreDialog isOpen={isOpen} onOpenChange={setIsOpen} genre={selected} />
        </div>
    )
}