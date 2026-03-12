import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTA() {
    return (
        <section className="py-20">
            <div className="container mx-auto px-4">
                <div className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-16 text-center space-y-6">
                    <h2 className="text-3xl md:text-4xl font-bold">Prêt à transformer votre bibliothèque ?</h2>
                    <p className="text-primary-foreground/80 max-w-xl mx-auto text-lg">
                        Rejoignez des milliers de lecteurs et de bibliothécaires qui utilisent déjà LibManager.ai pour simplifier leur quotidien.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button size="lg" variant="secondary" asChild>
                            <Link href="/register">Créer mon compte gratuit</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10" asChild>
                            <Link href="/contact">Parler à un expert</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}