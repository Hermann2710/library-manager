import { BookMarked, Handshake, ListChecks, Sparkles } from "lucide-react";

export function Stats() {
    const stats = [
        { icon: BookMarked, label: "Catalogue", value: "Ouvrages, auteurs, editeurs" },
        { icon: Handshake, label: "Prets", value: "Lecteur, date, validation, retour" },
        { icon: ListChecks, label: "Stock", value: "Exemplaires, rayons, etats" },
        { icon: Sparkles, label: "Suggestions", value: "Requetes pour orienter les lecteurs" },
    ];

    return (
        <section className="border-y bg-muted/35 py-10">
            <div className="container mx-auto grid gap-4 px-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="flex gap-3 rounded-md border bg-card p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                            <stat.icon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-bold">{stat.label}</p>
                            <p className="text-sm leading-6 text-muted-foreground">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
