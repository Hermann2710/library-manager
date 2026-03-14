"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getCategories, deleteCategory } from "@/actions/taxonomy-actions"
import { DataTable } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash, Bookmark, Hash, Layers3 } from "lucide-react"
import { toast } from "sonner"
import { ColumnDef } from "@tanstack/react-table"
import { CategoryDialog } from "./category-dialog"
import { cn } from "@/lib/utils"

/**
 * CategoryManager Component:
 * Sub-module of the Taxonomy system.
 * Handles thematic classification (e.g., Computer Science, Philosophy).
 */
export function CategoryManager() {
    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState<any>(null)
    const queryClient = useQueryClient()

    /**
     * Thematic Data Fetching:
     * Pulls the hierarchical list of categories for the library structure.
     */
    const { data = [], isLoading } = useQuery({
        queryKey: ["categories"],
        queryFn: () => getCategories()
    })

    /**
     * Category Deletion Mutation:
     * Removes the thematic node. Note: Usually triggers a cascade check on linked items.
     */
    const { mutate: remove } = useMutation({
        mutationFn: deleteCategory,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categories"] })
            toast.success("Registre mis à jour : Catégorie thématique retirée");
        },
        onError: (err: any) => toast.error(err.message || "Erreur lors de la suppression")
    })

    // Specialized columns for the Taxonomy view
    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Thématique",
            cell: ({ row }) => (
                <div className="flex items-center gap-3 py-1">
                    <div className="h-8 w-8 rounded-xl bg-primary/5 flex items-center justify-center border border-primary/10">
                        <Bookmark className="h-4 w-4 text-primary" />
                    </div>
                    <span className="font-black uppercase italic tracking-tighter text-[13px]">
                        {row.getValue("name")}
                    </span>
                </div>
            )
        },
        {
            accessorKey: "description",
            header: "Notes d'Indexation",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Layers3 className="h-3 w-3 text-muted-foreground/40" />
                    <span className="text-[11px] font-medium text-muted-foreground italic line-clamp-1 max-w-100">
                        {row.original.description || "Aucune spécification thématique."}
                    </span>
                </div>
            )
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <div className="flex justify-end gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => { setSelected(row.original); setIsOpen(true); }}
                        className="h-9 w-9 rounded-xl hover:bg-primary/5 hover:text-primary transition-all"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(row.original._id)}
                        className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/10 transition-all"
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
    ]

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* HEADER ACTION: Styled for focal attention */}
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground/50" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                        Index Thématique
                    </span>
                </div>
                <Button
                    onClick={() => { setSelected(null); setIsOpen(true); }}
                    className="rounded-2xl font-black uppercase text-[10px] tracking-widest px-6 h-11 italic shadow-md shadow-primary/10 hover:scale-105 transition-all"
                >
                    <Plus className="mr-2 h-4 w-4" /> Nouvelle Catégorie
                </Button>
            </div>

            {/* TAXONOMY TABLE: Minimalist and clean for complex data */}
            <div className="rounded-[2rem] border border-border/40 overflow-hidden bg-background/30 shadow-inner">
                <DataTable
                    columns={columns}
                    data={data}
                    loading={isLoading}
                />
            </div>

            {/* MODAL: Creation & Update logic */}
            <CategoryDialog
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                category={selected}
            />
        </div>
    )
}