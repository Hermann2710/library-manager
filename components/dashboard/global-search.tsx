"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import {
    Search, Book, User, PenTool, Loader2,
    Hash, Landmark, Tags, MapPin, ShieldCheck, Briefcase,
    PlusCircle, ListFilter, History, LayoutDashboard, Clock
} from "lucide-react";
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator
} from "@/components/ui/command";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface RecentItem {
    id: string;
    title: string;
    type: string;
    url: string;
}

export function GlobalSearch() {
    const { data: session } = useSession();
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState<any[]>([]);
    const [recent, setRecent] = React.useState<RecentItem[]>([]);
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();

    const role = (session?.user as any)?.role;

    // Charger l'historique au montage
    React.useEffect(() => {
        const saved = localStorage.getItem("recent-searches");
        if (saved) setRecent(JSON.parse(saved));
    }, []);

    // Raccourcis clavier
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    // Recherche API avec Debounce
    React.useEffect(() => {
        const search = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                return;
            }
            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(Array.isArray(data) ? data : []);
            } finally {
                setLoading(false);
            }
        };
        const timer = setTimeout(search, 300);
        return () => clearTimeout(timer);
    }, [query]);

    const saveToRecent = (item: RecentItem) => {
        const updated = [item, ...recent.filter((r) => r.id !== item.id)].slice(0, 5);
        setRecent(updated);
        localStorage.setItem("recent-searches", JSON.stringify(updated));
    };

    const navigate = (path: string, item?: RecentItem) => {
        if (item) saveToRecent(item);
        setOpen(false);
        router.push(path);
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "Ouvrage": return <Book className="mr-2 h-4 w-4 text-blue-500" />;
            case "Auteur": return <PenTool className="mr-2 h-4 w-4 text-orange-500" />;
            case "Membre": return <User className="mr-2 h-4 w-4 text-green-500" />;
            case "Exemplaire": return <Hash className="mr-2 h-4 w-4 text-purple-500" />;
            case "Éditeur": return <Landmark className="mr-2 h-4 w-4 text-yellow-600" />;
            case "Taxonomie (Cat)":
            case "Taxonomie (Genre)": return <Tags className="mr-2 h-4 w-4 text-pink-500" />;
            case "Emplacement": return <MapPin className="mr-2 h-4 w-4 text-red-500" />;
            case "Utilisateur": return <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />;
            case "Mes Emprunts": return <Briefcase className="mr-2 h-4 w-4 text-emerald-500" />;
            default: return <Search className="mr-2 h-4 w-4" />;
        }
    };

    const types = Array.from(new Set(results.map(r => r.type)));

    return (
        <>
            <Button
                variant="outline"
                className="relative h-9 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground lg:w-64 border-none shadow-none"
                onClick={() => setOpen(true)}
            >
                <Search className="mr-2 h-4 w-4" />
                <span>Recherche globale...</span>
                <kbd className="absolute right-[0.3rem] top-[0.3rem] hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <Command className="rounded-lg border shadow-md">
                    <CommandInput
                        placeholder="Que cherchez-vous ?"
                        value={query}
                        onValueChange={setQuery}
                    />
                    <CommandList className="max-h-112.5">
                        {query.length < 2 && (
                            <>
                                {recent.length > 0 && (
                                    <CommandGroup heading="Recherches récentes">
                                        {recent.map((item) => (
                                            <CommandItem key={item.id} onSelect={() => navigate(item.url, item)}>
                                                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                                <span>{item.title}</span>
                                                <span className="ml-auto text-[10px] text-muted-foreground uppercase">{item.type}</span>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                )}

                                <CommandGroup heading="Tableaux de bord">
                                    <CommandItem onSelect={() => navigate("/dashboard")}>
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        <span>Mon espace personnel</span>
                                    </CommandItem>
                                    {(role === "librarian" || role === "admin") && (
                                        <CommandItem onSelect={() => navigate("/dashboard/librarian")}>
                                            <Book className="mr-2 h-4 w-4 text-blue-500" />
                                            <span>Gestion Bibliothèque</span>
                                        </CommandItem>
                                    )}
                                    {role === "admin" && (
                                        <CommandItem onSelect={() => navigate("/dashboard/admin")}>
                                            <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
                                            <span>Administration Système</span>
                                        </CommandItem>
                                    )}
                                </CommandGroup>

                                <CommandSeparator />

                                <CommandGroup heading="Actions rapides">
                                    {(role === "librarian" || role === "admin") ? (
                                        <>
                                            <CommandItem onSelect={() => navigate("/dashboard/librarian/works/new")}>
                                                <PlusCircle className="mr-2 h-4 w-4 text-green-500" />
                                                <span>Enregistrer un ouvrage</span>
                                            </CommandItem>
                                            <CommandItem onSelect={() => navigate("/dashboard/librarian/loans")}>
                                                <ListFilter className="mr-2 h-4 w-4 text-orange-500" />
                                                <span>Retours à traiter</span>
                                            </CommandItem>
                                        </>
                                    ) : (
                                        <>
                                            <CommandItem onSelect={() => navigate("/dashboard/search")}>
                                                <Search className="mr-2 h-4 w-4" />
                                                <span>Parcourir le catalogue</span>
                                            </CommandItem>
                                            <CommandItem onSelect={() => navigate("/dashboard/my-loans")}>
                                                <Briefcase className="mr-2 h-4 w-4 text-emerald-500" />
                                                <span>Mes emprunts en cours</span>
                                            </CommandItem>
                                        </>
                                    )}
                                </CommandGroup>
                            </>
                        )}

                        {!loading && query.length >= 2 && results.length === 0 && (
                            <CommandEmpty>Aucun résultat pour "{query}".</CommandEmpty>
                        )}

                        {loading && (
                            <div className="p-4 flex justify-center">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                        )}

                        {!loading && types.map((type: any) => (
                            <CommandGroup key={type} heading={type}>
                                {results.filter(r => r.type === type).map((item) => (
                                    <CommandItem
                                        key={`${item.type}-${item.id}`}
                                        value={`${item.type}-${item.title}-${item.id}`}
                                        onSelect={() => navigate(item.url, item)}
                                    >
                                        {getIcon(item.type)}
                                        <span>{item.title}</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ))}
                    </CommandList>
                </Command>
            </CommandDialog>
        </>
    );
}