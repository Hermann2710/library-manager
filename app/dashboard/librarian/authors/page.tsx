"use client"

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuthors, deleteAuthor } from "@/actions/author-actions";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getAuthorColumns } from "@/components/dashboard/author/author-columns";
import { AuthorDialog } from "@/components/dashboard/author/author-dialog";
import { DashboardContainer } from "@/components/shared/dashboard-container";

export default function AuthorsPage() {
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedAuthor, setSelectedAuthor] = useState<any>(null);

    const { data: authors = [], isLoading } = useQuery({
        queryKey: ["authors"],
        queryFn: () => getAuthors(),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteAuthor,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authors"] });
            toast.success("Auteur définitivement supprimé");
        },
        onError: () => toast.error("Impossible de supprimer cet auteur"),
    });

    const handleEdit = (author: any) => {
        setSelectedAuthor(author);
        setIsDialogOpen(true);
    };

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
                    className="rounded-full font-black uppercase text-[10px] tracking-widest px-6 italic"
                >
                    <Plus className="mr-2 h-4 w-4" /> Ajouter un auteur
                </Button>
            }
        >
            <div className="space-y-6">
                <div className="rounded-md p-4 border bg-card shadow-sm overflow-hidden">
                    <DataTable
                        columns={getAuthorColumns(handleEdit, (id) => deleteMutation.mutate(id))}
                        data={authors}
                        loading={isLoading}
                    />
                </div>

                {isLoading && (
                    <div className="flex flex-col items-center justify-center py-12 gap-3">
                        <Loader2 className="h-6 w-6 animate-spin text-primary/30" />
                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                            Lecture des notices biographiques...
                        </p>
                    </div>
                )}
            </div>

            <AuthorDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                author={selectedAuthor}
            />
        </DashboardContainer>
    );
}