import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const tiers = [
    {
        name: "Gratuit",
        price: "0€",
        description: "Parfait pour les petites collections personnelles.",
        features: ["Jusqu'à 100 livres", "1 utilisateur", "Support communautaire"],
        buttonText: "Commencer",
        variant: "outline" as const,
    },
    {
        name: "Pro",
        price: "29€",
        description: "La puissance de l'IA pour les bibliothèques actives.",
        features: ["Livres illimités", "5 utilisateurs", "IA Recommandations", "Support prioritaire"],
        buttonText: "Essai gratuit",
        variant: "default" as const,
    },
    {
        name: "Entreprise",
        price: "Sur devis",
        description: "Solution sur mesure pour les grandes institutions.",
        features: ["Multi-sites", "Utilisateurs illimités", "API personnalisée", "Gestionnaire dédié"],
        buttonText: "Nous contacter",
        variant: "outline" as const,
    },
];

export function Pricing() {
    return (
        <section id="pricing" className="py-24 container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
                <h2 className="text-3xl font-bold">Des tarifs simples et transparents</h2>
                <p className="text-muted-foreground">Choisissez le plan qui correspond à vos besoins.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {tiers.map((tier) => (
                    <Card key={tier.name} className={tier.name === "Pro" ? "border-primary shadow-lg scale-105" : ""}>
                        <CardHeader>
                            <CardTitle>{tier.name}</CardTitle>
                            <CardDescription>{tier.description}</CardDescription>
                            <div className="text-3xl font-bold pt-4">{tier.price}<span className="text-sm font-normal text-muted-foreground">/mois</span></div>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-3 text-sm">
                                {tier.features.map((f) => (
                                    <li key={f} className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary" /> {f}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant={tier.variant}>{tier.buttonText}</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </section>
    );
}