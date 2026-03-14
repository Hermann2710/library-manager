import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * CTA (Call to Action) Component.
 * A high-contrast section designed to capture final conversions.
 * Features a large rounded container with entrance animations.
 */
export function CTA() {
    return (
        <section className="py-20 overflow-hidden">
            <div className="container mx-auto px-4">
                {/* Main CTA Box: 
                    Uses the primary color to stand out from the rest of the page.
                    Animated with a slide-up and scale-in effect.
                */}
                <div className="bg-primary text-primary-foreground rounded-3xl p-8 md:p-16 text-center space-y-6 animate-in fade-in zoom-in-95 slide-in-from-bottom-10 duration-1000 fill-mode-backwards">

                    {/* Catchy headline to trigger the user's decision 
                    */}
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Prêt à transformer votre bibliothèque ?
                    </h2>

                    {/* Supporting text with reduced opacity for better visual hierarchy 
                    */}
                    <p className="text-primary-foreground/80 max-w-xl mx-auto text-lg">
                        Rejoignez des milliers de lecteurs et de bibliothécaires qui utilisent déjà LibManager.ai pour simplifier leur quotidien.
                    </p>

                    {/* Action buttons: 
                        Strategic use of 'secondary' variant for the main action 
                        to ensure high visibility against the primary background.
                    */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                        <Button
                            size="lg"
                            variant="secondary"
                            className="h-12 px-8 font-semibold hover:scale-105 transition-transform"
                            asChild
                        >
                            <Link href="/register">
                                Créer mon compte gratuit
                            </Link>
                        </Button>

                        <Button
                            size="lg"
                            variant="outline"
                            className="h-12 px-8 bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10 hover:border-primary-foreground/40 transition-all"
                            asChild
                        >
                            <Link href="/contact">
                                Parler à un expert
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    );
}