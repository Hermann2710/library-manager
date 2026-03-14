"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import {
    Search, Book, User, PenTool, Loader2,
    Hash, Landmark, Tags, MapPin, ShieldCheck, Briefcase,
    PlusCircle, ListFilter, LayoutDashboard, Clock
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
import { cn } from "@/lib/utils";

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

    React.useEffect(() => {
        const saved = localStorage.getItem("recent-searches");
        if (saved) setRecent(JSON.parse(saved));
    }, []);

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
        const iconClass = "mr-3 h-4 w-4 opacity-70 shrink-0";
        switch (type) {
            case "Ouvrage": return <Book className={cn(iconClass, "text-primary")} />;
            case "Auteur": return <PenTool className={cn(iconClass, "text-orange-500")} />;
            case "Membre": return <User className={cn(iconClass, "text-emerald-500")} />;
            case "Exemplaire": return <Hash className={cn(iconClass, "text-purple-500")} />;
            case "Éditeur": return <Landmark className={cn(iconClass, "text-yellow-600")} />;
            case "Taxonomie (Cat)":
            case "Taxonomie (Genre)": return <Tags className={cn(iconClass, "text-pink-500")} />;
            case "Emplacement": return <MapPin className={cn(iconClass, "text-red-500")} />;
            case "Utilisateur": return <ShieldCheck className={cn(iconClass, "text-indigo-500")} />;
            case "Mes Emprunts": return <Briefcase className={cn(iconClass, "text-sky-500")} />;
            default: return <Search className={iconClass} />;
        }
    };

    const types = Array.from(new Set(results.map(r => r.type)));

    return (
        <>
            <Button
                variant="outline"
                className="relative h-10 w-full justify-start rounded-xl bg-muted/40 text-[11px] font-black uppercase italic tracking-widest text-muted-foreground/60 lg:w-72 border-none shadow-inner hover:bg-muted/60 transition-all group"
                onClick={() => setOpen(true)}
            >
                <Search className="mr-3 h-4 w-4 group-hover:text-primary transition-colors" />
                <span>Search Core v2...</span>
                <kbd className="absolute right-2 top-2 hidden h-6 select-none items-center gap-1 rounded-lg border border-border/40 bg-background px-2 font-mono text-[10px] font-bold sm:flex shadow-sm">
                    <span className="text-[10px]">CTRL</span>K
                </kbd>
            </Button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <Command className="rounded-[2.5rem] border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col">

                    <div className="border-b bg-muted/10">
                        <CommandInput
                            placeholder="RECHERCHE GLOBALE D'INDEX..."
                            value={query}
                            onValueChange={setQuery}
                            className="h-16 w-full font-black uppercase italic tracking-tighter placeholder:text-muted-foreground/30 focus:ring-0 border-none bg-transparent"
                        />
                    </div>

                    <CommandList className="max-h-125 scrollbar-hide p-4">
                        {query.length < 2 && (
                            <>
                                {recent.length > 0 && (
                                    <CommandGroup heading={<span className="text-[10px] font-black uppercase tracking-[0.3em] italic text-primary/40 px-2">Récents</span>}>
                                        {recent.map((item) => (
                                            <CommandItem
                                                key={item.id}
                                                onSelect={() => navigate(item.url, item)}
                                                className="rounded-xl py-3 px-4 mb-1 cursor-pointer flex items-center justify-between"
                                            >
                                                <div className="flex items-center min-w-0 flex-1">
                                                    <Clock className="mr-3 h-4 w-4 text-muted-foreground/40 shrink-0" />
                                                    <span className="text-xs font-bold uppercase tracking-tight truncate">{item.title}</span>
                                                </div>
                                                <span className="ml-4 text-[8px] font-black uppercase tracking-widest bg-muted px-2 py-0.5 rounded-md opacity-40 shrink-0">
                                                    {item.type}
                                                </span>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                )}

                                <CommandGroup heading={<span className="text-[10px] font-black uppercase tracking-[0.3em] italic text-primary/40 px-2 mt-4">Système</span>}>
                                    <CommandItem onSelect={() => navigate("/dashboard")} className="rounded-xl py-3 px-4 mb-1 cursor-pointer flex items-center">
                                        <LayoutDashboard className="mr-3 h-4 w-4 text-primary/40 shrink-0" />
                                        <span className="text-xs font-bold uppercase tracking-tight italic">Terminal Personnel</span>
                                    </CommandItem>
                                    {(role === "librarian" || role === "admin") && (
                                        <CommandItem onSelect={() => navigate("/dashboard/librarian")} className="rounded-xl py-3 px-4 mb-1 cursor-pointer flex items-center">
                                            <Book className="mr-3 h-4 w-4 text-primary/40 shrink-0" />
                                            <span className="text-xs font-bold uppercase tracking-tight italic">Gestion Stock & Flux</span>
                                        </CommandItem>
                                    )}
                                </CommandGroup>

                                <CommandSeparator className="my-4 opacity-40" />

                                <CommandGroup heading={<span className="text-[10px] font-black uppercase tracking-[0.3em] italic text-primary/40 px-2">Actions Directes</span>}>
                                    {(role === "librarian" || role === "admin") ? (
                                        <>
                                            <CommandItem onSelect={() => navigate("/dashboard/librarian/works/new")} className="rounded-xl py-3 px-4 mb-1 cursor-pointer flex items-center">
                                                <PlusCircle className="mr-3 h-4 w-4 text-emerald-500/60 shrink-0" />
                                                <span className="text-xs font-bold uppercase tracking-tight italic">Nouvelle Indexation</span>
                                            </CommandItem>
                                            <CommandItem onSelect={() => navigate("/dashboard/librarian/loans")} className="rounded-xl py-3 px-4 mb-1 cursor-pointer flex items-center">
                                                <ListFilter className="mr-3 h-4 w-4 text-orange-500/60 shrink-0" />
                                                <span className="text-xs font-bold uppercase tracking-tight italic">Monitoring des retours</span>
                                            </CommandItem>
                                        </>
                                    ) : (
                                        <CommandItem onSelect={() => navigate("/dashboard/search")} className="rounded-xl py-3 px-4 mb-1 cursor-pointer flex items-center">
                                            <Search className="mr-3 h-4 w-4 text-sky-500/60 shrink-0" />
                                            <span className="text-xs font-bold uppercase tracking-tight italic">Parcourir le catalogue global</span>
                                        </CommandItem>
                                    )}
                                </CommandGroup>
                            </>
                        )}

                        {!loading && query.length >= 2 && results.length === 0 && (
                            <CommandEmpty className="py-10 text-center">
                                <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-20 italic">Aucune donnée correspondante</div>
                            </CommandEmpty>
                        )}

                        {loading && (
                            <div className="py-10 flex flex-col items-center justify-center gap-3">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                <span className="text-[8px] font-black uppercase tracking-[0.5em] opacity-30">Scan des registres...</span>
                            </div>
                        )}

                        {!loading && types.map((type: any) => (
                            <CommandGroup key={type} heading={<span className="text-[10px] font-black uppercase tracking-[0.3em] italic text-primary/40 px-2">{type}</span>}>
                                {results.filter(r => r.type === type).map((item) => (
                                    <CommandItem
                                        key={`${item.type}-${item.id}`}
                                        value={`${item.type}-${item.title}-${item.id}`}
                                        onSelect={() => navigate(item.url, item)}
                                        className="rounded-xl py-4 px-4 mb-1 cursor-pointer hover:bg-muted/50 flex items-center"
                                    >
                                        <div className="flex items-center min-w-0 flex-1">
                                            {getIcon(item.type)}
                                            <span className="text-[13px] font-black uppercase italic tracking-tighter truncate">
                                                {item.title}
                                            </span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ))}
                    </CommandList>

                    <div className="border-t p-3 flex items-center justify-between bg-muted/20 mt-auto">
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5 opacity-30">
                                <kbd className="bg-background px-1.5 py-0.5 rounded text-[9px] font-black border border-border/40">ESC</kbd>
                                <span className="text-[8px] font-bold uppercase">Fermer</span>
                            </div>
                            <div className="flex items-center gap-1.5 opacity-30">
                                <kbd className="bg-background px-1.5 py-0.5 rounded text-[9px] font-black border border-border/40">↵</kbd>
                                <span className="text-[8px] font-bold uppercase">Sélectionner</span>
                            </div>
                        </div>
                        <span className="text-[8px] font-black uppercase italic tracking-[0.3em] opacity-20">LibManager Core v2.1</span>
                    </div>
                </Command>
            </CommandDialog>
        </>
    );
}