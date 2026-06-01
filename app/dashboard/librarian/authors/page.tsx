"use client"

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuthors, deleteAuthor } from "@/actions/author-actions";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, PenTool } from "lucide-react";
import { toast } from "sonner";
import { getAuthorColumns } from "@/components/dashboard/author/author-columns";
import { AuthorDialog } from "@/components/dashboard/author/author-dialog";
import { DashboardContainer } from "@/components/shared/dashboard-container";
import { cn } from "@/lib/utils";

/**
 * AuthorsPage Component:
 * Central hub for managing the library's author repository.
 * It handles CRUD operations through a combination of TanStack Query 
 * and localized modal states.
 */
export default function AuthorsPage() {
    const queryClient = useQueryClient();

    // UI States for controlling the AuthorDialog (both Create and Update modes)
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState<any>(null);

    /**
     * Data Hydration:
     * Fetches the complete list of authors.
     */
    const { data: authors = [], isLoading } = useQuery({
        queryKey: ["authors"],
        queryFn: () => getAuthors(),
    });

    /**
     * Deletion Mutation:
     * Removes an author from the database and triggers a cache invalidation 
     * to keep the UI in sync.
     */
    const deleteMutation = useMutation({
        mutationFn: deleteAuthor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authors"] });
            toast.success("Author entry permanently removed");
        },
        onError: () => {
            toast.error("Deletion failed: This author might still be linked to active works.");
        },
    });

    // Opens the dialog in 'Edit' mode with existing data
    const handleEdit = (author: any) => {
        setSelectedAuthor(author);
        setIsDialogOpen(true);
    };

    // Opens the dialog in 'Create' mode
    const handleAdd = () => {
        setSelectedAuthor(null);
        setIsDialogOpen(true);
    };

    return (
        <DashboardContainer
            title="AUTEURS"
            subtitle="Référentiel"
            description="Gérez les notices biographiques des auteurs et liez-les aux œuvres du catalogue."
            actions={
                <Button
                    onClick={handleAdd}
                    className="rounded-full font-black uppercase text-[10px] tracking-[0.2em] px-8 h-12 italic shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                >
                    <Plus className="mr-2 h-4 w-4" /> Ajouter un auteur
                </Button>
            }
        >
            <div className="space-y-8 animate-in fade-in duration-700">
                {/* AUTHORS TABLE CONTAINER: Premium Glassmorphism Look */}
                <div className={cn(
                    "relative p-1 rounded-[2.5rem] border border-border/40 bg-card/50 backdrop-blur-sm overflow-hidden shadow-xl shadow-black/5",
                    isLoading && "opacity-60"
                )}>
                    <DataTable
                        // Passing the handlers to columns for row-level actions
                        columns={getAuthorColumns(handleEdit, (id) => deleteMutation.mutate(id))}
                        data={authors}
                        loading={isLoading}
                    />

                    {/* DEDICATED LOADER OVERLAY */}
                    {isLoading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-background/10 backdrop-blur-[2px] z-10 rounded-[2.5rem]">
                            <div className="p-4 bg-background rounded-2xl shadow-lg border border-border/20">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                            <div className="text-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground">
                                    Exploration
                                </p>
                                <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground italic">
                                    Lecture des notices biographiques...
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* BOTTOM INFO: Stats or contextual reminder */}
                {!isLoading && (
                    <div className="flex items-center gap-4 p-6 bg-primary/5 rounded-[2rem] border border-dashed border-primary/20">
                        <div className="p-3 bg-background rounded-2xl shadow-sm border border-border/10">
                            <PenTool className="h-5 w-5 text-primary/60" />
                        </div>
                        <div className="space-y-0.5">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/80">Base de données auteurs</h4>
                            <p className="text-[10px] text-muted-foreground italic font-medium">
                                {authors.length} auteurs référencés dans le catalogue BiblioGest CM.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* SHARED DIALOG: Reusable for both creation and updates */}
            <AuthorDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                author={selectedAuthor}
            />
        </DashboardContainer>
    );
}
