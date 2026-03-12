import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

export default function LoginPage() {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            {/* Colonne visuelle (Gauche) avec motif de lignes */}
            <div className="hidden lg:flex relative bg-primary/5 items-center justify-center overflow-hidden border-r">
                <div className="absolute inset-0 z-0 opacity-20 bg-[linear-gradient(to_right,#888_1px,transparent_1px),linear-gradient(to_bottom,#888_1px,transparent_1px)] bg-size-[40px_40px]" />

                <div className="relative z-10 text-center space-y-2">
                    <p className="text-4xl font-serif italic text-primary/80">Bienvenue.</p>
                    <p className="text-muted-foreground">Heureux de vous revoir parmi nous.</p>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center p-8 md:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Connexion</h1>
                        <p className="text-muted-foreground">Accédez à votre compte.</p>
                    </div>
                    <LoginForm />
                    <p className="text-center text-sm text-muted-foreground">
                        Pas encore de compte ? <Link href="/register" className="text-primary hover:underline font-medium">S'inscrire</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}