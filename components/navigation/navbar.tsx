"use client";

import Link from "next/link";
import { BookMarked, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

const navLinks = [
    { title: "Bibliotheque", href: "/#bibliotheque" },
    { title: "Suggestions", href: "/#suggestions" },
    { title: "Contact", href: "/contact" },
];

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold group">
                    <BookMarked className="h-6 w-6 text-primary transition-transform group-hover:rotate-6" />
                    <span className="hidden sm:inline-block">BiblioGest CM</span>
                </Link>

                <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
                    {navLinks.map((link) => (
                        <Link key={link.href} href={link.href} className="text-muted-foreground transition-colors hover:text-primary">
                            {link.title}
                        </Link>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <div className="hidden items-center gap-2 border-r pr-4 sm:flex">
                        <ThemeToggle />
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/login">Connexion</Link>
                        </Button>
                    </div>

                    <Button size="sm" className="hidden sm:flex" asChild>
                        <Link href="/register">Demarrer</Link>
                    </Button>

                    <div className="flex items-center gap-2 md:hidden">
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
                                        <BookMarked className="h-5 w-5 text-primary" />
                                        BiblioGest CM
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="mt-8 flex flex-col gap-6 px-2">
                                    {navLinks.map((link) => (
                                        <Link key={link.href} href={link.href} className="text-lg font-semibold transition-colors hover:text-primary">
                                            {link.title}
                                        </Link>
                                    ))}
                                    <hr className="my-2" />
                                    <div className="flex flex-col gap-3">
                                        <Button asChild className="h-11 w-full">
                                            <Link href="/register">Creer la structure</Link>
                                        </Button>
                                        <Button variant="outline" asChild className="h-11 w-full">
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
