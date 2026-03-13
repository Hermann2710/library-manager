"use client"

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";

export default function SearchBar({ defaultValue }: { defaultValue: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    function handleSearch(term: string) {
        const params = new URLSearchParams();
        if (term) params.set("q", term);
        else params.delete("q");

        startTransition(() => {
            router.replace(`${pathname}?${params.toString()}`);
        });
    }

    return (
        <div className="relative max-w-md">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isPending ? "text-primary animate-pulse" : "text-muted-foreground"}`} />
            <Input
                placeholder="Rechercher par titre, auteur..."
                className="pl-9 h-11 bg-muted/20 border-muted-foreground/10 focus:ring-primary shadow-sm"
                defaultValue={defaultValue}
                onChange={(e) => handleSearch(e.target.value)}
            />
        </div>
    );
}