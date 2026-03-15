import Link from "next/link";
import { MoveLeft, Mail, AlertCircle } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-[80vh] w-full flex flex-col items-center justify-center px-4">
            <div className="space-y-6 text-center">
                {/* Icône et Code erreur */}
                <div className="flex justify-center">
                    <div className="p-4 rounded-full bg-primary/10 text-primary animate-bounce">
                        <AlertCircle size={48} />
                    </div>
                </div>

                <div className="space-y-2">
                    <h1 className="text-7xl font-bold tracking-tighter text-foreground">
                        404
                    </h1>
                    <h2 className="text-2xl font-semibold text-muted-foreground">
                        Oups ! Page introuvable.
                    </h2>
                    <p className="max-w-100 mx-auto text-muted-foreground/80">
                        Désolé, la page que vous recherchez semble avoir été déplacée ou n'existe plus dans la bibliothèque.
                    </p>
                </div>

                {/* Boutons d'action */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium transition-all hover:opacity-90 active:scale-95"
                    >
                        <MoveLeft size={18} />
                        Retour à l'accueil
                    </Link>

                    <Link
                        href="/contact"
                        className="flex items-center gap-2 px-6 py-3 rounded-xl border border-input bg-background hover:bg-accent hover:text-accent-foreground font-medium transition-all active:scale-95"
                    >
                        <Mail size={18} />
                        Contacter l'admin
                    </Link>
                </div>
            </div>

            {/* Décoration en arrière-plan (Optionnel) */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 bg-primary/5 rounded-full blur-[100px]" />
        </div>
    );
}