"use client"

import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";

/**
 * SearchBar Component.
 * A high-performance search input that updates the URL in real-time.
 * It uses 'useTransition' to keep the UI responsive even during heavy data filtering.
 */
export default function SearchBar({ defaultValue }: { defaultValue: string }) {
    const router = useRouter();
    const pathname = usePathname();

    // isPending tells us if the URL update is still being processed by the server
    const [isPending, startTransition] = useTransition();

    /**
     * handleSearch:
     * Synchronizes the input value with the URL search parameters.
     * This allows users to share specific search results just by copying the link.
     */
    function handleSearch(term: string) {
        const params = new URLSearchParams();
        if (term) {
            params.set("q", term);
        } else {
            params.delete("q");
        }

        // We wrap the router update in startTransition to prevent the UI from 
        // freezing while Next.js fetches the new filtered data.
        startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        });
    }

    return (
        <div className="relative group">
            {/* Visual Feedback:
                The icon switches to a pulsing state or a loader when a search is active.
            */}
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center justify-center">
                {isPending ? (
                    <Loader2 className="h-4 w-4 text-primary animate-spin" />
                ) : (
                    <Search className="h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                )}
            </div>

            <Input
                placeholder="Rechercher par titre, auteur..."
                className="pl-10 h-12 bg-muted/10 border-muted-foreground/10 rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary/50 shadow-sm transition-all"
                defaultValue={defaultValue}
                // We trigger the search on every keystroke for that 'instant search' feeling
                onChange={(e) => handleSearch(e.target.value)}
            />

            {/* Subtle loading indicator on the border when pending */}
            {isPending && (
                <div className="absolute bottom-0 left-0 h-0.5 bg-primary animate-in slide-in-from-left duration-1000 w-full rounded-full" />
            )}
        </div>
    );
}