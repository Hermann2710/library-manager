"use client";

import * as React from "react";
import { useSession } from "next-auth/react";
import {
    Book,
    Briefcase,
    Clock,
    Hash,
    Landmark,
    LayoutDashboard,
    ListFilter,
    Loader2,
    MapPin,
    PenTool,
    PlusCircle,
    Search,
    ShieldCheck,
    Tags,
    User,
} from "lucide-react";
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { canAccessPath, isRole, type AppRole } from "@/lib/access-control";
import { getDashboardSections } from "@/lib/dashboard-navigation";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type CommandResult = {
    id: string;
    title: string;
    type: string;
    url: string;
};

type QuickAction = {
    id: string;
    title: string;
    type: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
    roles: AppRole[];
};

const quickActions: QuickAction[] = [
    {
        id: "browse-catalog",
        title: "Parcourir le catalogue",
        type: "Action",
        url: "/dashboard/search",
        icon: Search,
        roles: ["reader", "librarian", "admin"],
    },
    {
        id: "my-loans",
        title: "Voir mes emprunts",
        type: "Action",
        url: "/dashboard/my-loans",
        icon: Briefcase,
        roles: ["reader", "librarian", "admin"],
    },
    {
        id: "manage-loans",
        title: "Valider les prets et retours",
        type: "Action staff",
        url: "/dashboard/librarian/loans",
        icon: ListFilter,
        roles: ["librarian", "admin"],
    },
    {
        id: "manage-works",
        title: "Gerer les ouvrages",
        type: "Action staff",
        url: "/dashboard/librarian/works",
        icon: PlusCircle,
        roles: ["librarian", "admin"],
    },
    {
        id: "manage-users",
        title: "Administrer les comptes",
        type: "Action admin",
        url: "/dashboard/admin/users",
        icon: ShieldCheck,
        roles: ["admin"],
    },
    {
        id: "admin-stats",
        title: "Consulter les statistiques",
        type: "Action admin",
        url: "/dashboard/admin/stats",
        icon: LayoutDashboard,
        roles: ["admin"],
    },
];

function safeRole(role: unknown): AppRole {
    return isRole(role) ? role : "reader";
}

function getIcon(type: string) {
    const iconClass = "mr-3 h-4 w-4 opacity-70 shrink-0";

    switch (type) {
        case "Ouvrage":
            return <Book className={cn(iconClass, "text-primary")} />;
        case "Auteur":
            return <PenTool className={cn(iconClass, "text-orange-500")} />;
        case "Membre":
            return <User className={cn(iconClass, "text-emerald-500")} />;
        case "Exemplaire":
            return <Hash className={cn(iconClass, "text-purple-500")} />;
        case "Editeur":
            return <Landmark className={cn(iconClass, "text-yellow-600")} />;
        case "Taxonomie":
        case "Categorie":
        case "Genre":
            return <Tags className={cn(iconClass, "text-pink-500")} />;
        case "Emplacement":
            return <MapPin className={cn(iconClass, "text-red-500")} />;
        case "Utilisateur":
            return <ShieldCheck className={cn(iconClass, "text-indigo-500")} />;
        case "Mes emprunts":
            return <Briefcase className={cn(iconClass, "text-sky-500")} />;
        default:
            return <Search className={iconClass} />;
    }
}

export function GlobalSearch() {
    const { data: session } = useSession();
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [results, setResults] = React.useState<CommandResult[]>([]);
    const [recent, setRecent] = React.useState<CommandResult[]>([]);
    const [loading, setLoading] = React.useState(false);
    const router = useRouter();

    const role = safeRole(session?.user?.role);
    const visibleSections = React.useMemo(() => getDashboardSections(role), [role]);
    const visibleActions = React.useMemo(
        () => quickActions.filter((action) => action.roles.includes(role) && canAccessPath(action.url, role)),
        [role]
    );
    const visibleRecent = React.useMemo(
        () => recent.filter((item) => canAccessPath(item.url, role)),
        [recent, role]
    );

    React.useEffect(() => {
        const saved = localStorage.getItem(`recent-searches:${role}`);
        if (!saved) return;

        try {
            setRecent(JSON.parse(saved));
        } catch {
            setRecent([]);
        }
    }, [role]);

    React.useEffect(() => {
        const down = (event: KeyboardEvent) => {
            if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                setOpen((current) => !current);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    React.useEffect(() => {
        const search = async () => {
            const trimmedQuery = query.trim();

            if (trimmedQuery.length < 2) {
                setResults([]);
                return;
            }

            setLoading(true);

            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`);
                const data = await response.json();
                const allowedResults = Array.isArray(data)
                    ? data.filter((item: CommandResult) => canAccessPath(item.url, role))
                    : [];

                setResults(allowedResults);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(search, 300);
        return () => clearTimeout(timer);
    }, [query, role]);

    const saveToRecent = (item: CommandResult) => {
        const updated = [item, ...recent.filter((recentItem) => recentItem.id !== item.id)].slice(0, 6);
        setRecent(updated);
        localStorage.setItem(`recent-searches:${role}`, JSON.stringify(updated));
    };

    const navigate = (path: string, item?: CommandResult) => {
        if (!canAccessPath(path, role)) return;

        if (item) saveToRecent(item);
        setOpen(false);
        setQuery("");
        router.push(path);
    };

    const groupedResults = React.useMemo(() => {
        return Array.from(new Set(results.map((result) => result.type))).map((type) => ({
            type,
            items: results.filter((result) => result.type === type),
        }));
    }, [results]);

    return (
        <>
            <Button
                variant="outline"
                className="relative h-10 w-full justify-start rounded-lg border-none bg-muted/40 text-[11px] font-black uppercase tracking-widest text-muted-foreground/60 shadow-inner transition-all hover:bg-muted/60 lg:w-72"
                onClick={() => setOpen(true)}
            >
                <Search className="mr-3 h-4 w-4 transition-colors group-hover:text-primary" />
                <span>Commandes et recherche...</span>
                <kbd className="absolute right-2 top-2 hidden h-6 select-none items-center gap-1 rounded-md border border-border/40 bg-background px-2 font-mono text-[10px] font-bold shadow-sm sm:flex">
                    <span className="text-[10px]">CTRL</span>K
                </kbd>
            </Button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <Command className="flex flex-col overflow-hidden rounded-lg border-border/40 bg-background/95 shadow-2xl backdrop-blur-xl">
                    <div className="border-b bg-muted/10">
                        <CommandInput
                            placeholder={`Rechercher comme ${role}...`}
                            value={query}
                            onValueChange={setQuery}
                            className="h-16 w-full border-none bg-transparent font-black uppercase tracking-tight placeholder:text-muted-foreground/30 focus:ring-0"
                        />
                    </div>

                    <CommandList className="max-h-125 p-4">
                        {query.trim().length < 2 && (
                            <>
                                {visibleRecent.length > 0 && (
                                    <CommandGroup heading={<span className="px-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">Recents</span>}>
                                        {visibleRecent.map((item) => (
                                            <CommandItem
                                                key={item.id}
                                                value={`recent-${item.type}-${item.title}`}
                                                onSelect={() => navigate(item.url, item)}
                                                className="mb-1 flex cursor-pointer items-center justify-between rounded-lg px-4 py-3"
                                            >
                                                <div className="flex min-w-0 flex-1 items-center">
                                                    <Clock className="mr-3 h-4 w-4 shrink-0 text-muted-foreground/40" />
                                                    <span className="truncate text-xs font-bold uppercase tracking-tight">{item.title}</span>
                                                </div>
                                                <span className="ml-4 shrink-0 rounded-md bg-muted px-2 py-0.5 text-[8px] font-black uppercase tracking-widest opacity-50">
                                                    {item.type}
                                                </span>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                )}

                                {visibleSections.map((section) => (
                                    <CommandGroup
                                        key={section.title}
                                        heading={<span className="px-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">{section.title}</span>}
                                    >
                                        {section.items.map((item) => (
                                            <CommandItem
                                                key={item.url}
                                                value={`nav-${item.title}`}
                                                onSelect={() => navigate(item.url)}
                                                className="mb-1 flex cursor-pointer items-center rounded-lg px-4 py-3"
                                            >
                                                <item.icon className="mr-3 h-4 w-4 shrink-0 text-primary/50" />
                                                <span className="text-xs font-bold uppercase tracking-tight">{item.title}</span>
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                ))}

                                <CommandSeparator className="my-4 opacity-40" />

                                <CommandGroup heading={<span className="px-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">Actions rapides</span>}>
                                    {visibleActions.map((action) => (
                                        <CommandItem
                                            key={action.id}
                                            value={`action-${action.title}`}
                                            onSelect={() => navigate(action.url, action)}
                                            className="mb-1 flex cursor-pointer items-center rounded-lg px-4 py-3"
                                        >
                                            <action.icon className="mr-3 h-4 w-4 shrink-0 text-primary/50" />
                                            <span className="text-xs font-bold uppercase tracking-tight">{action.title}</span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </>
                        )}

                        {!loading && query.trim().length >= 2 && results.length === 0 && (
                            <CommandEmpty className="py-10 text-center">
                                <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Aucune donnee correspondante</div>
                            </CommandEmpty>
                        )}

                        {loading && (
                            <div className="flex flex-col items-center justify-center gap-3 py-10">
                                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                <span className="text-[8px] font-black uppercase tracking-[0.5em] opacity-40">Recherche...</span>
                            </div>
                        )}

                        {!loading && groupedResults.map((group) => (
                            <CommandGroup
                                key={group.type}
                                heading={<span className="px-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary/50">{group.type}</span>}
                            >
                                {group.items.map((item) => (
                                    <CommandItem
                                        key={`${item.type}-${item.id}`}
                                        value={`${item.type}-${item.title}-${item.id}`}
                                        onSelect={() => navigate(item.url, item)}
                                        className="mb-1 flex cursor-pointer items-center rounded-lg px-4 py-4 hover:bg-muted/50"
                                    >
                                        <div className="flex min-w-0 flex-1 items-center">
                                            {getIcon(item.type)}
                                            <span className="truncate text-[13px] font-black uppercase tracking-tight">
                                                {item.title}
                                            </span>
                                        </div>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        ))}
                    </CommandList>

                    <div className="mt-auto flex items-center justify-between border-t bg-muted/20 p-3">
                        <div className="flex gap-4">
                            <div className="flex items-center gap-1.5 opacity-40">
                                <kbd className="rounded border border-border/40 bg-background px-1.5 py-0.5 text-[9px] font-black">ESC</kbd>
                                <span className="text-[8px] font-bold uppercase">Fermer</span>
                            </div>
                            <div className="flex items-center gap-1.5 opacity-40">
                                <kbd className="rounded border border-border/40 bg-background px-1.5 py-0.5 text-[9px] font-black">Enter</kbd>
                                <span className="text-[8px] font-bold uppercase">Selectionner</span>
                            </div>
                        </div>
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] opacity-30">BiblioGest CM</span>
                    </div>
                </Command>
            </CommandDialog>
        </>
    );
}
