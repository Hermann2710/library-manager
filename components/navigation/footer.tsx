import { BookMarked } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t bg-muted/30">
            <div className="container mx-auto grid grid-cols-2 gap-10 px-4 py-12 md:grid-cols-4">
                <div className="col-span-2 space-y-4">
                    <Link href="/" className="flex w-fit items-center gap-2 text-xl font-bold transition-opacity hover:opacity-90">
                        <BookMarked className="h-6 w-6 text-primary" />
                        <span>BiblioGest CM</span>
                    </Link>
                    <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                        Une application pensee pour les librairies et bibliotheques camerounaises qui veulent gerer leur catalogue, leurs prets et leur equipe.
                    </p>
                </div>

                <div>
                    <h4 className="mb-4 font-bold text-foreground">Application</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>
                            <Link href="/#bibliotheque" className="transition-colors hover:text-primary">
                                Bibliotheque
                            </Link>
                        </li>
                        <li>
                            <Link href="/#suggestions" className="transition-colors hover:text-primary">
                                Suggestions
                            </Link>
                        </li>
                        <li>
                            <Link href="/register" className="transition-colors hover:text-primary">
                                Creer la structure
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h4 className="mb-4 font-bold text-foreground">Legal</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>
                            <Link href="/confidentialite" className="transition-colors hover:text-primary">
                                Confidentialite
                            </Link>
                        </li>
                        <li>
                            <Link href="/cgu" className="transition-colors hover:text-primary">
                                CGU
                            </Link>
                        </li>
                        <li>
                            <Link href="/cookies" className="transition-colors hover:text-primary">
                                Cookies
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="border-t py-6 text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} BiblioGest CM - Tous droits reserves.
            </div>
        </footer>
    );
}
