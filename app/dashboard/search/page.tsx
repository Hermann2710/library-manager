import { Suspense } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import SearchBar from "@/components/dashboard/search/search-bar";
import BookList from "@/components/dashboard/books/book-list";

export default async function CatalogPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>;
}) {
    const query = (await searchParams).q || "";

    return (
        <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full">
            <header className="flex flex-col gap-1">
                <h1 className="text-3xl font-black tracking-tighter">BIBLIOTHÈQUE</h1>
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest">
                    Disponibilité en temps réel
                </p>
            </header>

            <SearchBar defaultValue={query} />

            {/* Le Suspense affiche un loader ou des squelettes pendant le chargement des données */}
            <Suspense key={query} fallback={<div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>}>
                <BookList query={query} />
            </Suspense>
        </div>
    );
}