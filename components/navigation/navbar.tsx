"use client";

import * as React from "react";
import Link from "next/link";
import { Library, Menu, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

/**
 * Navigation links configuration for easy maintenance.
 */
const navLinks = [
    { title: "Fonctionnalités", href: "/#features" },
    { title: "Tarifs", href: "/#pricing" },
    { title: "Contact", href: "/contact" },
];

/**
 * Navbar Component.
 * Features a sticky glassmorphism header with a responsive mobile drawer.
 */
export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 animate-in fade-in duration-500">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">

                {/* Logo Section
                    Features a subtle hover animation on the icon.
                */}
                <Link href="/" className="flex items-center gap-2 font-bold text-xl group">
                    <Library className="h-6 w-6 text-primary transition-transform group-hover:rotate-12" />
                    <span className="hidden sm:inline-block">
                        LibManager<span className="text-primary">.ai</span>
                    </span>
                </Link>

                {/* Desktop Navigation
                    Links animate with a staggered delay for a professional entrance.
                */}
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    {navLinks.map((link, i) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-muted-foreground hover:text-primary transition-colors animate-in fade-in slide-in-from-top-2 fill-mode-backwards"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            {link.title}
                        </Link>
                    ))}
                </nav>

                {/* Actions & Mobile Menu 
                    Contains theme switching, authentication, and the mobile trigger.
                */}
                <div className="flex items-center gap-2">
                    <div className="hidden sm:flex items-center gap-2 border-r pr-4 mr-2">
                        <ThemeToggle />
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/login">Connexion</Link>
                        </Button>
                    </div>

                    <Button size="sm" className="hidden sm:flex group" asChild>
                        <Link href="/register">
                            Démarrer
                            <Sparkles className="ml-2 h-4 w-4 transition-all group-hover:scale-125" />
                        </Link>
                    </Button>

                    {/* Mobile Menu Drawer (Shadcn Sheet)
                        Optimized for touch interactions on smaller screens.
                    */}
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
                                    <SheetTitle className="flex items-center gap-2 border-b pb-4">
                                        <Library className="h-5 w-5 text-primary" /> LibManager
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col gap-6 mt-8 px-2">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className="text-lg font-semibold hover:text-primary transition-colors"
                                        >
                                            {link.title}
                                        </Link>
                                    ))}
                                    <hr className="my-2" />
                                    <div className="flex flex-col gap-3">
                                        <Button asChild className="w-full h-11">
                                            <Link href="/register">Essayer gratuitement</Link>
                                        </Button>
                                        <Button variant="outline" asChild className="w-full h-11">
                                            <Link href="/login">Connexion</Link>
                                        </Button>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    );
}