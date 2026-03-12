'use client';

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerAction } from "@/actions/auth-actions";
import { registerSchema, RegisterInput } from "@/lib/validation/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, CheckCircle2 } from "lucide-react";

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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
            {/* Messages d'état serveur */}
            {serverError && (
                <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <p>{serverError}</p>
                </div>
            )}
            {serverSuccess && (
                <div className="bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500">
                    <CheckCircle2 className="h-4 w-4" />
                    <p>{serverSuccess}</p>
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input id="name" {...register("name")} placeholder="John Doe" disabled={isSubmitting} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} placeholder="m@example.com" disabled={isSubmitting} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" type="password" {...register("password")} disabled={isSubmitting} />
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
                {isSubmitting ? "Création..." : "Créer un compte"}
            </Button>
        </form>
    );
}