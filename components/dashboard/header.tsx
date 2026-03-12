"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "../shared/theme-toggle"
import { Search, Bell, Command } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

export function DashboardHeader() {
    const pathname = usePathname()
    const segments = pathname.split('/').filter(Boolean)

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b px-6 bg-background/95 backdrop-blur-sm sticky top-0 z-30">
            {/* GAUCHE : Navigation et Breadcrumbs */}
            <div className="flex items-center gap-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="h-6 hidden sm:block" />

                <Breadcrumb className="hidden md:block">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard" className="transition-colors hover:text-primary">
                                LibManager
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        {segments.map((segment, index) => {
                            if (segment === "dashboard") return null
                            return (
                                <div key={segment} className="flex items-center gap-2">
                                    <BreadcrumbSeparator />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage className="capitalize font-medium">
                                            {segment.replace("-", " ")}
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                </div>
                            )
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* CENTRE : Recherche Globale (Idéal pour tes livres/utilisateurs) */}
            <div className="flex-1 max-w-md hidden lg:block">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Recherche rapide... (CMD + K)"
                        className="pl-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary w-full"
                    />
                    <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                        <span className="text-xs">⌘</span>K
                    </kbd>
                </div>
            </div>

            {/* DROITE : Actions contextuelles */}
            <div className="flex items-center gap-2 sm:gap-4">
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-5 w-5 text-muted-foreground" />
                                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive border-2 border-background" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Notifications</TooltipContent>
                    </Tooltip>
                </TooltipProvider>

                <Separator orientation="vertical" className="h-6 hidden sm:block" />

                <div className="flex items-center gap-2">
                    <ThemeToggle />
                </div>
            </div>
        </header>
    )
}