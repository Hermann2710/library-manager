import { Button } from "@/components/ui/button";
import Link from "next/link";

export function CTA() {
    return (
        <section className="px-4 py-16">
            <div className="container mx-auto rounded-lg border bg-primary p-8 text-primary-foreground md:p-12">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div className="max-w-2xl space-y-2">
                        <h2 className="text-3xl font-black tracking-tight">Pret a structurer votre librairie ?</h2>
                        <p className="text-primary-foreground/80">
                            Connectez-vous, ajoutez vos ouvrages, vos emplacements et vos membres, puis laissez BiblioGest CM clarifier le travail quotidien.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button variant="secondary" className="rounded-md" asChild>
                            <Link href="/register">Creer la structure</Link>
                        </Button>
                        <Button variant="outline" className="rounded-md border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10" asChild>
                            <Link href="/login">Connexion</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}
