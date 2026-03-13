"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getCategories, deleteCategory } from "@/actions/taxonomy-actions"
import { DataTable } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash } from "lucide-react"
import { toast } from "sonner"
import { ColumnDef } from "@tanstack/react-table"
import { CategoryDialog } from "./category-dialog"

export function CategoryManager() {
    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState<any>(null)
    const queryClient = useQueryClient()

    const { data = [], isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: () => getCategories()
    })

    const { mutate: remove } = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            toast.success("Catégorie supprimé")
        }
    })

    const columns: ColumnDef<any>[] = [
        { accessorKey: "name", header: "Nom de la catégorie" },
        {
            accessorKey: "description",
            header: "Description",
            cell: ({ row }) => <span className="text-muted-foreground">{row.original.description || "-"}</span>
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
                    <Plus className="mr-2 h-4 w-4" /> Ajouter une catégorie
                </Button>
            </div>
            <DataTable columns={columns} data={data} loading={isLoading} />
            <CategoryDialog isOpen={isOpen} onOpenChange={setIsOpen} category={selected} />
        </div>
    )
}