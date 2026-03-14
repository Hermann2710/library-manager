import { Brain, Zap, Shield, Users, BarChart3, Globe } from "lucide-react";

/**
 * FeaturesGrid Component.
 * Showcases the core value propositions of LibManager.ai using a 3-column grid.
 * Features staggered entrance animations using native Tailwind CSS classes.
 */
export function FeaturesGrid() {
    // Array of features with associated Lucide icons and descriptions
    const features = [
        { icon: <Brain className="h-6 w-6" />, title: "IA de Recommandation", desc: "Analyse les goûts des lecteurs pour suggérer leur prochain coup de cœur." },
        { icon: <Zap className="h-6 w-6" />, title: "Automatisation", desc: "Gérez les retours et les amendes sans lever le petit doigt." },
        { icon: <Shield className="h-6 w-6" />, title: "Sécurité", desc: "Vos données et celles de vos lecteurs sont chiffrées et protégées." },
        { icon: <Users className="h-6 w-6" />, title: "Multi-Rôles", desc: "Accès dédiés pour les lecteurs, bibliothécaires et administrateurs." },
        { icon: <BarChart3 className="h-6 w-6" />, title: "Analytics", desc: "Visualisez les tendances de lecture de votre communauté en temps réel." },
        { icon: <Globe className="h-6 w-6" />, title: "Accès Cloud", desc: "Consultez votre catalogue partout, sur mobile ou ordinateur." },
    ];

    return (
        <section id="features" className="py-24 container mx-auto px-4 overflow-hidden">
            {/* Section Header: Slide up animation with a smooth fade-in 
            */}
            <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-backwards">
                <h2 className="text-3xl md:text-4xl font-bold">Tout ce qu'il vous faut pour briller.</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    Une suite d'outils puissants conçus pour moderniser votre gestion documentaire.
                </p>
            </div>

            {/* Features Grid: Responsive layout (1 col on mobile, 3 on desktop) 
            */}
            <div className="grid md:grid-cols-3 gap-8">
                {features.map((f, i) => (
                    <div
                        key={i}
                        className="p-8 border rounded-2xl bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group animate-in fade-in slide-in-from-bottom-12 fill-mode-backwards"
                        style={{
                            // Staggered entrance: each card waits slightly longer than the previous one
                            animationDelay: `${(i + 1) * 150}ms`,
                            animationDuration: "800ms"
                        }}
                    >
                        {/* Icon Container: Interactive color inversion on card hover 
                        */}
                        <div className="mb-6 text-primary bg-primary/10 w-fit p-4 rounded-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 group-hover:rotate-6">
                            {f.icon}
                        </div>

                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                            {f.title}
                        </h3>

                        <p className="text-muted-foreground leading-relaxed">
                            {f.desc}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}