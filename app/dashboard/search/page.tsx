import { Suspense } from "react";
import { Loader2, BookOpen } from "lucide-react";
import SearchBar from "@/components/dashboard/search/search-bar";
import BookList from "@/components/dashboard/books/book-list";
import { DashboardContainer } from "@/components/shared/dashboard-container";

/**
 * CatalogPage: The public-facing library directory.
 * It allows anyone to browse and search for books. Since it relies on URL search params,
 * we use Suspense to handle the streaming of the book list based on the user's query.
 */
export default async function CatalogPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    // Await search params to capture the 'q' query from the URL for filtering
    const query = (await searchParams).q || "";

    return (
        <DashboardContainer
            title="BIBLIOTHÈQUE"
            subtitle="Catalogue"
            description="Disponibilité des ouvrages en temps réel dans tout l'établissement."
            actions={
                /* Read-Only Badge: Subtle indicator that this section is for viewing only */
                <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase bg-muted/30 px-4 py-2 rounded-xl border border-border/50 shadow-sm animate-in fade-in duration-500">
                    <BookOpen className="h-3.5 w-3.5 text-primary/60" />
                    Lecture Seule
                </div>
            }
        >
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Search Hub: 
                    Wrapped in a card-like container to separate the search action 
                    from the results display.
                */}
                <SearchBar defaultValue={query} />


                {/* Book Results:
                    The 'key={query}' on Suspense is crucial here—it tells Next.js to 
                    trigger a new loading state every time the search query changes.
                */}
                <Suspense
                    key={query}
                    fallback={
                        /* A centered, clean loading state that keeps the user engaged */
                        <div className="flex flex-col items-center justify-center py-40 gap-6">
                            <div className="relative">
                                <Loader2 className="h-12 w-12 animate-spin text-primary opacity-20" />
                                <BookOpen className="h-5 w-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40" />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
                                Chargement des rayons...
                            </p>
                        </div>
                    }
                >
                    <div className="animate-in fade-in duration-1000">
                        <BookList query={query} />
                    </div>
                </Suspense>
            </div>
        </DashboardContainer>
    );
}