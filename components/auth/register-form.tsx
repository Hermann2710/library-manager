'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerAction } from "@/actions/auth-actions";
import { registerSchema, RegisterInput } from "@/lib/validation/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";
import { SocialAuth } from "./social-auth";
import Link from "next/link";

export function RegisterForm() {
    const [serverError, setServerError] = useState<string | null>(null);
    const [serverSuccess, setServerSuccess] = useState<string | null>(null);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema as any),
    });

    const onSubmit = async (data: RegisterInput) => {
        setServerError(null);
        setServerSuccess(null);

        const res = await registerAction(data);

        if (res?.error) setServerError(res.error);
        if (res?.success) setServerSuccess(res.success);
    };

    return (
        <div className="w-full space-y-8">
            {/* Clean back button with Lucide icon and hover effect */}
            <div className="mb-2">
                <Link
                    href="/"
                    className="group inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                    Retour à l'accueil
                </Link>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Server-side feedback messages */}
                {serverError && (
                    <div className="bg-destructive/15 p-3 rounded-xl flex items-center gap-x-2 text-sm text-destructive animate-in fade-in slide-in-from-top-1">
                        <AlertCircle className="h-4 w-4" />
                        <p>{serverError}</p>
                    </div>
                )}
                {serverSuccess && (
                    <div className="bg-emerald-500/15 p-3 rounded-xl flex items-center gap-x-2 text-sm text-emerald-500 animate-in fade-in slide-in-from-top-1">
                        <CheckCircle2 className="h-4 w-4" />
                        <p>{serverSuccess}</p>
                    </div>
                )}

                <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input id="name" {...register("name")} placeholder="John Doe" disabled={isSubmitting} className="h-11" />
                    {errors.name && <p className="text-xs text-destructive font-medium">{errors.name.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register("email")} placeholder="m@example.com" disabled={isSubmitting} className="h-11" />
                    {errors.email && <p className="text-xs text-destructive font-medium">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input id="password" type="password" {...register("password")} disabled={isSubmitting} className="h-11" />
                    {errors.password && <p className="text-xs text-destructive font-medium">{errors.password.message}</p>}
                </div>

                <Button type="submit" className="w-full h-11 mt-2 shadow-lg shadow-primary/5" disabled={isSubmitting}>
                    {/* Feedback during the account creation process */}
                    {isSubmitting ? "Création..." : "Créer un compte"}
                </Button>
            </form>

            <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-4 text-muted-foreground font-medium">Ou s'inscrire via</span>
                </div>
            </div>

            {/* Reusing the social buttons with their icons */}
            <SocialAuth />

            <p className="text-center text-sm text-muted-foreground pt-2">
                Déjà inscrit ?{" "}
                <Link href="/login" className="text-primary hover:underline font-semibold">
                    Se connecter
                </Link>
            </p>
        </div>
    );
}