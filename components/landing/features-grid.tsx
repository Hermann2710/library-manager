import { Brain, Zap, Shield, Users, BarChart3, Globe } from "lucide-react";

export function FeaturesGrid() {
    const features = [
        { icon: <Brain className="h-6 w-6" />, title: "IA de Recommandation", desc: "Analyse les goûts des lecteurs pour suggérer leur prochain coup de cœur." },
        { icon: <Zap className="h-6 w-6" />, title: "Automatisation", desc: "Gérez les retours et les amendes sans lever le petit doigt." },
        { icon: <Shield className="h-6 w-6" />, title: "Sécurité", desc: "Vos données et celles de vos lecteurs sont chiffrées et protégées." },
        { icon: <Users className="h-6 w-6" />, title: "Multi-Rôles", desc: "Accès dédiés pour les lecteurs, bibliothécaires et administrateurs." },
        { icon: <BarChart3 className="h-6 w-6" />, title: "Analytics", desc: "Visualisez les tendances de lecture de votre communauté en temps réel." },
        { icon: <Globe className="h-6 w-6" />, title: "Accès Cloud", desc: "Consultez votre catalogue partout, sur mobile ou ordinateur." },
    ];

    return (
        <section id="features" className="py-24 container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">Tout ce qu'il vous faut pour briller.</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">Une suite d'outils puissants conçus pour moderniser votre gestion documentaire.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
                {features.map((f, i) => (
                    <div key={i} className="p-8 border rounded-2xl bg-card hover:shadow-md transition-shadow group">
                        <div className="mb-4 text-primary bg-primary/10 w-fit p-3 rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                            {f.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}