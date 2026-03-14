"use client";

import * as React from "react";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
    const { setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative hover:bg-muted/60 transition-colors group"
                >
                    <Sun className="h-5 w-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90 group-hover:text-primary" />
                    <Moon className="absolute h-5 w-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0 group-hover:text-primary" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-40 rounded-2xl border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl p-2 overflow-hidden"
            >
                <DropdownMenuItem
                    onClick={() => setTheme("light")}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer focus:bg-muted/50"
                >
                    <Sun className="h-4 w-4 text-orange-500/60" />
                    <span className="text-[10px] font-black uppercase italic tracking-widest">Light</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => setTheme("dark")}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer focus:bg-muted/50"
                >
                    <Moon className="h-4 w-4 text-primary/60" />
                    <span className="text-[10px] font-black uppercase italic tracking-widest">Dark</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                    onClick={() => setTheme("system")}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer focus:bg-muted/50 border-t border-border/10 mt-1"
                >
                    <Monitor className="h-4 w-4 opacity-40" />
                    <span className="text-[10px] font-black uppercase italic tracking-widest opacity-40">System</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}