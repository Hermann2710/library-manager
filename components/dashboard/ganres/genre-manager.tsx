"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getGenres, deleteGenre } from "@/actions/taxonomy-actions"
import { DataTable } from "@/components/shared/data-table"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash, Library, Fingerprint, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { ColumnDef } from "@tanstack/react-table"
import { GenreDialog } from "./genre-dialog"
import { cn } from "@/lib/utils"

/**
 * GenreManager Component:
 * Part of the Taxonomy suite.
 * Focuses on literary styles and artistic forms (e.g., Novel, Poetry, Essay).
 */
export function GenreManager() {
    const [isOpen, setIsOpen] = useState(false)
    const [selected, setSelected] = useState<any>(null)
    const queryClient = useQueryClient()

    /**
     * Literary Style Fetching:
     * Pulls the registry of genres to define the library's artistic diversity.
     */
    const { data = [], isLoading } = useQuery({
        queryKey: ["genres"],
        queryFn: () => getGenres()
    })

    /**
     * Genre Deletion Mutation:
     * Removes a literary genre. Note: Impact is usually global across the catalog.
     */
    const { mutate: remove } = useMutation({
        mutationFn: deleteGenre,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["genres"] })
            toast.success("Registre mis à jour : Genre littéraire retiré");
        },
        onError: (err: any) => toast.error(err.message || "Échec de la suppression du genre")
    })

    // Columns tailored for the Artistic Taxonomy view
    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "name",
            header: "Style Littéraire",
            cell: ({ row }) => (
                <div className="flex items-center gap-4 py-1">
                    <div className="h-9 w-9 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm">
                        <Library className="h-4.5 w-4.5 text-primary" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-black uppercase italic tracking-tighter text-[13px] leading-tight">
                            {row.original.name}
                        </span>
                        <span className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest mt-0.5">
                            Classification Formelle
                        </span>
                    </div>
                </div>
            )
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <div className="flex justify-end gap-3">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => { setSelected(row.original); setIsOpen(true); }}
                        className="h-10 w-10 rounded-2xl hover:bg-muted border border-transparent hover:border-border/40 transition-all shadow-sm active:scale-95"
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(row.original._id)}
                        className="h-10 w-10 rounded-2xl text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 transition-all shadow-sm active:scale-95"
                    >
                        <Trash className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
    ]

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* HEADER ACTION: Literary focus */}
            <div className="flex items-center justify-between pb-2 border-b border-border/40">
                <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary/60" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                        Registre des Styles
                    </span>
                </div>
                <Button
                    onClick={() => { setSelected(null); setIsOpen(true); }}
                    className="rounded-2xl font-black uppercase text-[10px] tracking-widest px-8 h-11 italic shadow-lg shadow-primary/10 hover:scale-105 transition-all"
                >
                    <Plus className="mr-2 h-4 w-4" /> Nouveau Genre
                </Button>
            </div>

            {/* TAXONOMY TABLE: Artistic registry layout */}
            <div className="rounded-[2rem] border border-border/40 overflow-hidden bg-card/30 backdrop-blur-sm shadow-xl shadow-black/5">
                <DataTable
                    columns={columns}
                    data={data}
                    loading={isLoading}
                />
            </div>

            {/* GENRE MODAL: Handing the literary form definitions */}
            <GenreDialog
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                genre={selected}
            />
        </div>
    )
}