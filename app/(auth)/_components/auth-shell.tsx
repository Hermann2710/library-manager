import { ThemeToggle } from "@/components/shared/theme-toggle";
import { BadgeCheck, BookOpenCheck, LibraryBig, LockKeyhole, UsersRound } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  mode: "login" | "register";
};

const metrics = [
  { label: "Catalogue", value: "1 200+" },
  { label: "Membres", value: "Actifs" },
  { label: "Prets", value: "Suivis" },
];

const features = [
  { icon: LibraryBig, label: "Catalogue centralise" },
  { icon: UsersRound, label: "Membres et roles" },
  { icon: BookOpenCheck, label: "Prets et retours" },
  { icon: LockKeyhole, label: "Acces securise" },
];

export function AuthShell({ children, eyebrow, title, description, mode }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden border-r bg-secondary/35 lg:flex">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-size-[56px_56px] opacity-45" />
          <div className="relative flex w-full flex-col justify-between p-10 xl:p-14">
            <Link href="/" className="inline-flex w-fit items-center gap-3 text-sm font-black uppercase tracking-widest">
              <span className="flex size-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <LibraryBig className="size-5" />
              </span>
              BiblioGest Cameroun
            </Link>

            <div className="max-w-xl space-y-8">
              <div className="inline-flex items-center gap-2 rounded-md border bg-background/85 px-3 py-2 text-xs font-bold text-muted-foreground shadow-sm">
                <BadgeCheck className="size-4 text-primary" />
                Espace interne de gestion
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-black leading-tight tracking-tight xl:text-5xl">
                  Une entree claire pour piloter la librairie au quotidien.
                </h2>
                <p className="max-w-lg text-base leading-7 text-muted-foreground">
                  Catalogue, membres, prets, retours et statistiques restent organises selon le role connecte.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {metrics.map((metric) => (
                  <div key={metric.label} className="rounded-lg border bg-background/85 p-4 shadow-sm">
                    <p className="text-xl font-black">{metric.value}</p>
                    <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {features.map((feature) => (
                <div key={feature.label} className="flex items-center gap-3 rounded-lg border bg-background/85 p-3 text-sm font-semibold shadow-sm">
                  <feature.icon className="size-4 text-primary" />
                  {feature.label}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex min-h-screen flex-col bg-background">
          <div className="flex items-center justify-between border-b px-5 py-4 lg:justify-end lg:border-b-0 lg:px-8">
            <Link href="/" className="inline-flex items-center gap-2 font-black uppercase tracking-tight lg:hidden">
              <LibraryBig className="size-5 text-primary" />
              BiblioGest
            </Link>
            <ThemeToggle />
          </div>

          <div className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
            <div className="w-full max-w-md">
              <div className="mb-7 space-y-3">
                <p className="text-[11px] font-black uppercase tracking-widest text-primary">{eyebrow}</p>
                <div className="space-y-2">
                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{title}</h1>
                  <p className="text-sm leading-6 text-muted-foreground">{description}</p>
                </div>
              </div>

              <div className="rounded-lg border bg-card p-5 shadow-sm sm:p-6">{children}</div>

              <p className="mt-5 text-center text-xs text-muted-foreground">
                {mode === "login"
                  ? "Connexion protegee par session securisee."
                  : "Creation de compte soumise aux regles de la structure."}
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
