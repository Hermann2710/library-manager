"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Check, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const themeOptions = [
    { value: "light", label: "Clair", icon: Sun },
    { value: "dark", label: "Sombre", icon: Moon },
    { value: "system", label: "Systeme", icon: Monitor },
];

export function ThemeToggle({ showLabel = false }: { showLabel?: boolean }) {
    const { theme, resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => setMounted(true), []);

    const activeTheme = theme || "system";
    const isDark = mounted && resolvedTheme === "dark";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size={showLabel ? "default" : "icon"}
                    className={cn(
                        "rounded-md border-border/60 bg-background/80 shadow-sm transition-colors hover:bg-muted",
                        showLabel && "justify-start gap-2"
                    )}
                    aria-label="Changer le theme"
                >
                    {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                    {showLabel && <span className="text-sm font-medium">Theme : {themeOptions.find((item) => item.value === activeTheme)?.label}</span>}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-44 rounded-lg p-1">
                {themeOptions.map((option) => (
                    <DropdownMenuItem
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2"
                    >
                        <option.icon className="h-4 w-4 text-muted-foreground" />
                        <span className="flex-1 text-sm font-medium">{option.label}</span>
                        {activeTheme === option.value && <Check className="h-4 w-4 text-primary" />}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
