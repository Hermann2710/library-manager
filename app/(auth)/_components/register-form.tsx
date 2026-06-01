"use client";

import { registerAction } from "@/actions/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema, type RegisterInput } from "@/lib/validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, CheckCircle2, Loader2, LockKeyhole, Mail, UserRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { SocialAuth } from "./social-auth";

export function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
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
    <div className="w-full space-y-6">
      <Link href="/" className="group inline-flex items-center text-sm text-muted-foreground transition-colors hover:text-primary">
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        Retour a l'accueil
      </Link>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {serverError && (
          <div className="flex items-center gap-x-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive animate-in fade-in slide-in-from-top-1">
            <AlertCircle className="size-4" />
            <p>{serverError}</p>
          </div>
        )}
        {serverSuccess && (
          <div className="flex items-center gap-x-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-600 animate-in fade-in slide-in-from-top-1 dark:text-emerald-400">
            <CheckCircle2 className="size-4" />
            <p>{serverSuccess}</p>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="name">Nom complet</Label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input id="name" {...register("name")} placeholder="Nom du membre" disabled={isSubmitting} className="h-12 pl-10" />
          </div>
          {errors.name && <p className="text-xs font-medium text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              {...register("email")}
              placeholder="exemple@bibliogest.cm"
              disabled={isSubmitting}
              className="h-12 pl-10"
            />
          </div>
          {errors.email && <p className="text-xs font-medium text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Mot de passe</Label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              {...register("password")}
              disabled={isSubmitting}
              className="h-12 pl-10"
            />
          </div>
          {errors.password && <p className="text-xs font-medium text-destructive">{errors.password.message}</p>}
        </div>

        <Button type="submit" className="h-12 w-full font-bold shadow-sm" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Creation...
            </>
          ) : (
            "Creer un compte"
          )}
        </Button>
      </form>

      <div className="relative py-1">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-4 font-medium text-muted-foreground">Ou s'inscrire via</span>
        </div>
      </div>

      <SocialAuth />

      <p className="text-center text-sm text-muted-foreground">
        Deja inscrit ?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
