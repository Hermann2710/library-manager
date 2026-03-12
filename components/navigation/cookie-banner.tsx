'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

export function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // On vérifie si l'utilisateur a déjà fait un choix
        const consent = localStorage.getItem("cookie-consent");
        if (!consent) {
            setIsVisible(true);
        }
    }, []);

    const acceptCookies = () => {
        localStorage.setItem("cookie-consent", "accepted");
        setIsVisible(false);
    };

    const declineCookies = () => {
        localStorage.setItem("cookie-consent", "declined");
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 left-4 right-4 z-100 md:left-auto md:max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-card border shadow-lg rounded-2xl p-6">
                <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                        <Cookie className="h-6 w-6" />
                    </div>
                    <div className="space-y-3">
                        <h3 className="font-bold">Cookies & Confidentialité</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Nous utilisons des cookies pour améliorer votre expérience. En continuant, vous acceptez notre{" "}
                            <Link href="/cookies" className="text-primary hover:underline font-medium">
                                politique de cookies
                            </Link>.
                        </p>
                        <div className="flex gap-2 pt-2">
                            <Button size="sm" onClick={acceptCookies} className="flex-1">
                                Accepter
                            </Button>
                            <Button size="sm" variant="outline" onClick={declineCookies} className="flex-1">
                                Refuser
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}