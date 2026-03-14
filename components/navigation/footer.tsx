import { Library } from "lucide-react";
import Link from "next/link";

/**
 * Footer Component.
 * Provides global site navigation, legal links, and brand positioning.
 * Now includes a functional home link on the brand identity.
 */
export function Footer() {
    return (
        <footer className="bg-muted/30 border-t animate-in fade-in duration-1000">
            <div className="container mx-auto px-4 py-16 grid grid-cols-2 md:grid-cols-4 gap-12">

                {/* Brand Identity: 
                    Wrapped in a Link for better UX, allowing users to return home.
                */}
                <div className="col-span-2 space-y-4">
                    <Link
                        href="/"
                        className="font-bold text-xl flex items-center gap-2 group w-fit transition-opacity hover:opacity-90"
                    >
                        <Library className="h-6 w-6 text-primary transition-transform group-hover:-rotate-6" />
                        <span>
                            LibManager<span className="text-primary">.ai</span>
                        </span>
                    </Link>
                    <p className="text-muted-foreground max-w-xs text-sm leading-relaxed">
                        La solution cloud pour les bibliothèques modernes qui veulent exploiter la puissance de l'IA.
                    </p>
                </div>

                {/* Product Links Section */}
                <div>
                    <h4 className="font-bold mb-4 text-foreground">Produit</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>
                            <Link href="/#features" className="hover:text-primary transition-colors">
                                Fonctionnalités
                            </Link>
                        </li>
                        <li>
                            <Link href="/#pricing" className="hover:text-primary transition-colors">
                                Tarifs
                            </Link>
                        </li>
                        <li>
                            <Link href="/register" className="hover:text-primary transition-colors">
                                S'inscrire
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Legal Section */}
                <div>
                    <h4 className="font-bold mb-4 text-foreground">Légal</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>
                            <Link href="/confidentialite" className="hover:text-primary transition-colors">
                                Confidentialité
                            </Link>
                        </li>
                        <li>
                            <Link href="/cgu" className="hover:text-primary transition-colors">
                                CGU
                            </Link>
                        </li>
                        <li>
                            <Link href="/cookies" className="hover:text-primary transition-colors">
                                Cookies
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t py-8 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} LibManager.ai - Tous droits réservés.
            </div>
        </footer>
    );
}