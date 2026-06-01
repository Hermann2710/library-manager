import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, BookOpenCheck, LibraryBig, Sparkles } from "lucide-react";

export function Hero() {
    return (
        <section className="px-4 py-16 md:py-20">
            <div className="container mx-auto grid min-h-[68vh] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="max-w-2xl space-y-7 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="inline-flex items-center gap-2 rounded-md border bg-card px-3 py-1.5 text-sm font-medium text-muted-foreground shadow-sm">
                        <LibraryBig className="h-4 w-4 text-primary" />
                        <span>Gestion de librairie et bibliotheque au Cameroun</span>
                    </div>

                    <div className="space-y-5">
                        <h1 className="text-4xl font-black leading-tight tracking-tight md:text-6xl">
                            BiblioGest CM organise votre structure, du rayon au pret.
                        </h1>
                        <p className="max-w-xl text-base leading-7 text-muted-foreground md:text-lg">
                            Une application pour une librairie, une bibliotheque scolaire, associative ou privee qui veut suivre son catalogue, ses exemplaires, ses lecteurs, ses prets et son equipe sans se perdre.
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Button size="lg" className="h-11 rounded-md px-6" asChild>
                            <Link href="/dashboard/search">
                                Explorer le catalogue
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-11 rounded-md px-6" asChild>
                            <Link href="/login">Acceder a mon espace</Link>
                        </Button>
                    </div>
                </div>

                <div className="relative animate-in fade-in zoom-in-95 duration-700">
                    <div className="rounded-lg border bg-card p-5 shadow-sm">
                        <div className="mb-5 flex items-center justify-between border-b pb-4">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-primary">Lecture du soir</p>
                                <h2 className="text-xl font-black">Carnet de bibliotheque</h2>
                            </div>
                            <BookOpenCheck className="h-6 w-6 text-primary" />
                        </div>

                        <div className="space-y-3">
                            {[
                                ["A lire", "12 livres notes pour plus tard"],
                                ["Pretes", "3 ouvrages chez des proches"],
                                ["Suggestions", "Basees sur vos derniers ajouts"],
                            ].map(([label, value]) => (
                                <div key={label} className="flex items-center justify-between rounded-md border bg-background px-4 py-3">
                                    <span className="text-sm font-semibold">{label}</span>
                                    <span className="text-sm text-muted-foreground">{value}</span>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 rounded-md bg-primary/10 p-4 text-sm text-primary">
                            <div className="mb-1 flex items-center gap-2 font-bold">
                                <Sparkles className="h-4 w-4" />
                                Suggestion assistee
                            </div>
                        Ajoutez vos ouvrages, BiblioGest CM pourra ensuite proposer des pistes selon les genres, auteurs, langues et mouvements de pret observes dans la structure.
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
