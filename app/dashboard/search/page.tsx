import { Suspense } from "react";
import { Loader2, BookOpen } from "lucide-react";
import SearchBar from "@/components/dashboard/search/search-bar";
import BookList from "@/components/dashboard/books/book-list";
import { DashboardContainer } from "@/components/shared/dashboard-container";

export default async function CatalogPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const query = (await searchParams).q || "";

    return (
        <DashboardContainer
            title="BIBLIOTHÈQUE"
            subtitle="Catalogue"
            description="Disponibilité des ouvrages en temps réel dans tout l'établissement."
            actions={
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase bg-muted/30 px-3 py-1.5 rounded-md border">
                    <BookOpen className="h-3 w-3" />
                    Lecture Seule
                </div>
            }
        >
            <div className="space-y-6">
                {/* Barre de recherche spécifique au catalogue */}
                <div className="bg-card p-1 rounded-xl border shadow-sm">
                    <SearchBar defaultValue={query} />
                </div>

                {/* Liste des livres avec gestion du chargement */}
                <Suspense
                    key={query}
                    fallback={
                        <div className="flex flex-col items-center justify-center py-32 gap-4">
                            <Loader2 className="h-10 w-10 animate-spin text-primary opacity-20" />
                            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground animate-pulse">
                                Chargement des rayons...
                            </p>
                        </div>
                    }
                >
                    <BookList query={query} />
                </Suspense>
            </div>
        </DashboardContainer>
    );
}