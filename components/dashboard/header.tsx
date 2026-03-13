"use client"

import { useSession } from "next-auth/react" // Import du hook
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
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { NotificationBell } from "./notification-bell"
import { Skeleton } from "@/components/ui/skeleton" // Pour un chargement propre

export function DashboardHeader() {
    const { data: session, status } = useSession() // Récupération de la session
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
                        {segments.map((segment) => {
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

            {/* CENTRE : Recherche Globale */}
            <div className="flex-1 max-w-md hidden lg:block">
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Recherche rapide... (CMD + K)"
                        className="pl-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary w-full"
                    />
                </div>
            </div>

            {/* DROITE : Actions contextuelles */}
            <div className="flex items-center gap-2 sm:gap-4">
                {/* Gestion de l'affichage de la cloche selon l'état de la session */}
                {status === "loading" ? (
                    <Skeleton className="h-8 w-8 rounded-full" />
                ) : session?.user ? (
                    <NotificationBell
                        userId={session.user.id!}
                        role={(session.user as any).role}
                    />
                ) : null}

                <Separator orientation="vertical" className="h-6 hidden sm:block" />

                <div className="flex items-center gap-2">
                    <ThemeToggle />
                </div>
            </div>
        </header>
    )
}