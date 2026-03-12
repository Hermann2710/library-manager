// components/auth/login-form.tsx
'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { loginSchema, LoginInput } from "@/lib/validation/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginSchema as any),
    });

    const onSubmit = async (data: LoginInput) => {
        await signIn("credentials", { ...data, callbackUrl: "/" });
    };

    return (
        <div className="w-full space-y-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" {...register("email")} />
                    {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password">Mot de passe</Label>
                    <Input id="password" type="password" {...register("password")} />
                    {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
                </div>

                <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
                    {isSubmitting ? "Connexion..." : "Se connecter"}
                </Button>
            </form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Ou via</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Button variant="outline" onClick={() => signIn("github")}>GitHub</Button>
                <Button variant="outline" onClick={() => signIn("google")}>Google</Button>
            </div>
        </div>
    );
}