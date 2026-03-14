'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { loginSchema, LoginInput } from "@/lib/validation/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SocialAuth } from "./social-auth";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema as any),
    });

    const onSubmit = async (data: LoginInput) => {
        // Handling the response manually to show a toast before redirection
        const result = await signIn("credentials", {
            ...data,
            redirect: false
        });

        if (result?.error) {
            toast.error("Identifiants incorrects");
        } else {
            toast.success("Connexion réussie !");
            window.location.href = "/dashboard";
        }
    };

    return (
        <div className="w-full space-y-8">
            {/* Back home link with an icon. 
                Using a group for a subtle hover animation on the arrow.
            */}
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
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        {...register("email")}
                        className="h-11"
                    />
                    {errors.email && <p className="text-sm text-destructive font-medium">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Mot de passe</Label>
                    </div>
                    <Input
                        id="password"
                        type="password"
                        {...register("password")}
                        className="h-11"
                    />
                    {errors.password && <p className="text-sm text-destructive font-medium">{errors.password.message}</p>}
                </div>

                <Button type="submit" className="w-full h-11 mt-2" disabled={isSubmitting}>
                    {/* Visual state feedback for the user during the auth process */}
                    {isSubmitting ? "Connexion..." : "Se connecter"}
                </Button>
            </form>

            <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-4 text-muted-foreground font-medium">Ou via</span>
                </div>
            </div>

            {/* Reusable social login component */}
            <SocialAuth />

            <p className="text-center text-sm text-muted-foreground pt-2">
                Pas encore de compte ?{" "}
                <Link href="/register" className="text-primary hover:underline font-semibold">
                    S'inscrire
                </Link>
            </p>
        </div>
    );
}