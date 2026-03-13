"use client"

import { useSession } from "next-auth/react"
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
import { NotificationBell } from "./notification-bell"
import { GlobalSearch } from "./global-search"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardHeader() {
    const { data: session, status } = useSession()
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

            {/* CENTRE : Recherche Globale (Modal CMD+K) */}
            <div className="flex-1 max-w-md hidden lg:block">
                <GlobalSearch />
            </div>

            {/* DROITE : Actions contextuelles */}
            <div className="flex items-center gap-2 sm:gap-4">
                {/* Notification Bell */}
                {status === "loading" ? (
                    <Skeleton className="h-9 w-9 rounded-full" />
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