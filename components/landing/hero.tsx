import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function Hero() {
    return (
        <section className="py-24 px-4 text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                <span>Nouveau : Recommandations par IA disponibles</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                Gérez votre bibliothèque avec <span className="text-primary">intelligence.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Automatisez vos emprunts, gérez votre stock en temps réel et offrez à vos lecteurs des suggestions personnalisées grâce à notre moteur d'IA.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="h-12 px-8" asChild>
                    <Link href="/register">Commencer maintenant <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8">Voir la démo</Button>
            </div>
        </section>
    );
}