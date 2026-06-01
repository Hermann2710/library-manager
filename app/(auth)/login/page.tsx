import { LoginForm } from "../_components/login-form";
import { ThemeToggle } from "@/components/shared/theme-toggle";

/**
 * LoginPage component.
 * Features a split-screen layout with integrated theme management.
 */
export default function LoginPage() {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 relative">

            {/* Theme Switcher: Positioned absolutely for easy access without cluttering the UI */}
            <div className="absolute top-6 right-6 z-50">
                <ThemeToggle />
            </div>

            {/* Visual Column (Left) - Desktop only 
                Provides a calm, professional atmosphere using a subtle grid.
            */}
            <div className="hidden lg:flex relative bg-primary/5 items-center justify-center overflow-hidden border-r">
                {/* Geometric overlay to add depth without distraction */}
                <div className="absolute inset-0 z-0 opacity-10 bg-[linear-gradient(to_right,#888_1px,transparent_1px),linear-gradient(to_bottom,#888_1px,transparent_1px)] bg-size-[40px_40px]" />

                <div className="relative z-10 text-center space-y-2">
                    <p className="text-4xl font-serif italic text-primary/80">Bienvenue.</p>
                    <p className="text-muted-foreground">Heureux de vous revoir parmi nous.</p>
                </div>
            </div>

            {/* Form Column (Right) 
                Centrally focused to keep the user's attention on the authentication task.
            */}
            <div className="flex flex-col items-center justify-center p-8 md:p-12 bg-background">
                <div className="w-full max-w-md space-y-8">

                    {/* Brand/Action Header */}
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Connexion</h1>
                        <p className="text-muted-foreground text-sm italic">
                            Identifiez-vous pour accéder au tableau de bord.
                        </p>
                    </div>

                    {/* The core login logic and social providers */}
                    <LoginForm />

                    {/* Legal or Footer notes can go here */}
                    <p className="text-center text-[10px] text-muted-foreground/50 uppercase tracking-widest pt-4">
                        Protection des données activée
                    </p>
                </div>
            </div>
        </div>
    );
}
