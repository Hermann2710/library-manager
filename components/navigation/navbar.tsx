// components/navigation/navbar.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { Library, Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const navLinks = [
    { title: "Fonctionnalités", href: "/#features" },
    { title: "Tarifs", href: "/#pricing" },
    { title: "Contact", href: "/contact" },
];

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <Library className="h-6 w-6 text-primary" />
                    <span className="hidden sm:inline-block">LibManager<span className="text-primary">.ai</span></span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="text-muted-foreground hover:text-primary transition-colors">
                            {link.title}
                        </Link>
                    ))}
                </nav>

                {/* Actions & Mobile Menu */}
                <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-2 border-r pr-4 mr-2">
                        <ThemeToggle />
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/login">Connexion</Link>
                        </Button>
                    </div>

                    <Button size="sm" className="hidden sm:flex" asChild>
                        <Link href="/register">Démarrer</Link>
                    </Button>

                    {/* Mobile Menu Drawer */}
                    <div className="md:hidden flex items-center gap-2">
                        <ThemeToggle />
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-75 sm:w-100">
                                <SheetHeader>
                                    <SheetTitle className="flex items-center gap-2">
                                        <Library className="h-5 w-5 text-primary" /> LibManager
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col gap-4 mt-8 px-5">
                                    {navLinks.map((link) => (
                                        <Link key={link.href} href={link.href} className="text-lg font-semibold hover:text-primary">
                                            {link.title}
                                        </Link>
                                    ))}
                                    <hr className="my-2" />
                                    <Button asChild className="w-full">
                                        <Link href="/register">Essayer gratuitement</Link>
                                    </Button>
                                    <Button variant="outline" asChild className="w-full">
                                        <Link href="/login">Connexion</Link>
                                    </Button>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}