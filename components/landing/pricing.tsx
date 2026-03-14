import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

/**
 * Enhanced tiers data with navigation links.
 */
const tiers = [
    {
        name: "Gratuit",
        price: "0€",
        description: "Parfait pour les petites collections personnelles.",
        features: ["Jusqu'à 100 livres", "1 utilisateur", "Support communautaire"],
        buttonText: "Commencer",
        href: "/register",
        variant: "outline" as const,
    },
    {
        name: "Pro",
        price: "29€",
        description: "La puissance de l'IA pour les bibliothèques actives.",
        features: ["Livres illimités", "5 utilisateurs", "IA Recommandations", "Support prioritaire"],
        buttonText: "Essai gratuit",
        href: "/register",
        variant: "default" as const,
        featured: true,
    },
    {
        name: "Entreprise",
        price: "Sur devis",
        description: "Solution sur mesure pour les grandes institutions.",
        features: ["Multi-sites", "Utilisateurs illimités", "API personnalisée", "Gestionnaire dédié"],
        buttonText: "Nous contacter",
        href: "/contact",
        variant: "outline" as const,
    },
];

/**
 * Pricing Component.
 * Optimized with Next.js Link redirection and staggered animations.
 */
export function Pricing() {
    return (
        <section id="pricing" className="py-32 container mx-auto px-4">
            <div className="text-center mb-20 space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-backwards">
                <h2 className="text-3xl font-bold md:text-4xl tracking-tight">
                    Des tarifs simples et transparents
                </h2>
                <p className="text-muted-foreground text-lg">
                    Choisissez le plan qui correspond à vos besoins.
                </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
                {tiers.map((tier, i) => (
                    <Card
                        key={tier.name}
                        className={`relative flex flex-col transition-all duration-500 animate-in fade-in slide-in-from-bottom-12 fill-mode-backwards ${tier.featured
                            ? "border-primary shadow-2xl scale-105 z-10 bg-card ring-2 ring-primary/20"
                            : "hover:border-primary/50"
                            }`}
                        style={{
                            animationDelay: `${(i + 1) * 200}ms`,
                            animationDuration: "800ms"
                        }}
                    >
                        {tier.featured && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-md">
                                Recommandé
                            </div>
                        )}

                        <CardHeader>
                            <CardTitle className="text-2xl">{tier.name}</CardTitle>
                            <CardDescription className="min-h-10">
                                {tier.description}
                            </CardDescription>
                            <div className="text-4xl font-bold pt-4">
                                {tier.price}
                                {tier.price !== "Sur devis" && (
                                    <span className="text-sm font-normal text-muted-foreground ml-1">/mois</span>
                                )}
                            </div>
                        </CardHeader>

                        <CardContent className="flex-1">
                            <ul className="space-y-4 text-sm">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3 group/item">
                                        <div className="mt-0.5 rounded-full bg-primary/10 p-1 group-hover/item:bg-primary/20 transition-colors">
                                            <Check className="h-3 w-3 text-primary" />
                                        </div>
                                        <span className="text-muted-foreground group-hover/item:text-foreground transition-colors">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>

                        <CardFooter>
                            <Button
                                className="w-full h-11 text-base transition-transform active:scale-95"
                                variant={tier.variant}
                                asChild
                            >
                                {/* Link injection for correct navigation */}
                                <Link href={tier.href}>
                                    {tier.buttonText}
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section>
    );
}