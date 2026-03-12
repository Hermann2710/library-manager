export function Stats() {
    const stats = [
        { label: "Livres gérés", value: "50k+" },
        { label: "Utilisateurs actifs", value: "12k+" },
        { label: "Prêts automatisés", value: "100k+" },
        { label: "Précision IA", value: "99.9%" },
    ];

    return (
        <section className="py-12 border-y bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {stats.map((stat, i) => (
                        <div key={i} className="space-y-1">
                            <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                            <p className="text-sm text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}