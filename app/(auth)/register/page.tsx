import { RegisterForm } from "@/components/auth/register-form";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { BookOpen } from "lucide-react";
import Link from "next/link";

/**
 * RegisterPage component.
 * Inverts the split-screen layout for visual variety between Auth pages.
 */
export default function RegisterPage() {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative">

            {/* ThemeToggle: Floating in the corner for consistent UX */}
            <div className="absolute top-6 right-6 lg:left-6 lg:right-auto z-50">
                <ThemeToggle />
            </div>

            {/* Form Column (Left on Desktop) 
                Centrally focused registration flow.
            */}
            <div className="flex flex-col items-center justify-center p-8 md:p-12 bg-background">
                <div className="w-full max-w-md space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Inscription</h1>
                        <p className="text-muted-foreground">Devenez membre de la bibliothèque.</p>
                    </div>

                    <RegisterForm />
                </div>
            </div>

            {/* Visual Column (Right on Desktop)
                A clean aesthetic with decorative patterns.
            */}
            <div className="hidden lg:flex relative bg-primary/5 items-center justify-center overflow-hidden border-l">

                {/* Decorative background grid/dots */}
                <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(#888_1px,transparent_1px)] bg-size-[20px_20px]" />

                <div className="relative z-10 max-w-md text-center space-y-6 p-8">
                    {/* Using BookOpen from Lucide for a consistent icon style */}
                    <div className="bg-primary/10 inline-flex p-4 rounded-2xl mb-2 text-primary shadow-sm">
                        <BookOpen className="w-10 h-10" />
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-3xl font-bold tracking-tight">L'IA au service de votre culture.</h2>
                        <p className="text-muted-foreground text-lg font-serif italic opacity-80">
                            "Un livre est un outil de liberté."
                        </p>
                    </div>

                    {/* Minimalist status tag */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-background border border-border/50 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Système d'indexation actif
                    </div>
                </div>
            </div>
        </div>
    );
}