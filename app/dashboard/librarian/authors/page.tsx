"use client"

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuthors, deleteAuthor } from "@/actions/author-actions";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { toast } from "sonner";
import { getAuthorColumns } from "@/components/dashboard/author/author-columns";
import { AuthorDialog } from "@/components/dashboard/author/author-dialog";

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
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Catalogue des Auteurs</h1>
                    <p className="text-muted-foreground text-sm">Référencez les auteurs pour enrichir votre base de données.</p>
                </div>
                <Button onClick={handleAdd} className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" /> Ajouter un auteur
                </Button>
            </div>

            <DataTable
                columns={getAuthorColumns(handleEdit, (id) => deleteMutation.mutate(id))}
                data={authors}
                loading={isLoading}
            />

            <AuthorDialog
                isOpen={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                author={selectedAuthor}
            />
        </div>
    );
}