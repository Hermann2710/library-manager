import { RegisterForm } from "@/components/auth/register-form";
import Link from "next/link";

export default function RegisterPage() {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            <div className="flex flex-col items-center justify-center p-8 md:p-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Inscription</h1>
                        <p className="text-muted-foreground">Devenez membre de la bibliothèque.</p>
                    </div>
                    <RegisterForm />
                    <p className="text-center text-sm text-muted-foreground">
                        Déjà inscrit ? <Link href="/login" className="text-primary hover:underline font-medium">Se connecter</Link>
                    </p>
                </div>
            </div>

            {/* Colonne visuelle avec background stylisé */}
            <div className="hidden lg:flex relative bg-muted items-center justify-center overflow-hidden border-l">
                {/* Motif de fond (Dots) */}
                <div className="absolute inset-0 z-0 opacity-30 bg-[radial-gradient(#888_1px,transparent_1px)] bg-size-[20px_20px]" />

                <div className="relative z-10 max-w-md text-center space-y-4 p-6">
                    <div className="bg-primary/10 inline-flex p-3 rounded-2xl mb-4 text-primary">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5s3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18s-3.332.477-4.5 1.253" /></svg>
                    </div>
                    <h2 className="text-3xl font-bold">L'IA au service de votre culture.</h2>
                    <p className="text-muted-foreground text-lg italic">"Un livre est un outil de liberté."</p>
                </div>
            </div>
        </div>
    );
}