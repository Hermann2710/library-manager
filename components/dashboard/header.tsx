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

/**
 * DashboardHeader Component.
 * The functional brain of the dashboard's top navigation. It handles 
 * breadcrumbs dynamically and provides quick access to global tools.
 */
export function DashboardHeader() {
    // Checking who is logged in to tailor the experience (notifications, etc.)
    const { data: session, status } = useSession()

    // Parsing the URL to build a trail of where the user is currently standing
    const pathname = usePathname()
    const segments = pathname.split('/').filter(Boolean)

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b px-6 bg-background/95 backdrop-blur-sm sticky top-0 z-30 transition-all duration-300">

            {/* LEFT SECTION: Navigation controls and dynamic path display */}
            <div className="flex items-center gap-4">
                {/* Sidebar trigger with a subtle scale effect on click */}
                <SidebarTrigger className="-ml-1 hover:bg-accent transition-transform active:scale-95" />

                <Separator orientation="vertical" className="h-6 hidden sm:block opacity-50" />

                {/* Breadcrumbs: Helping the user keep track of their location within the app */}
                <Breadcrumb className="hidden md:block animate-in fade-in slide-in-from-left-4 duration-500">
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href="/dashboard" className="transition-colors hover:text-primary font-medium">
                                LibManager
                            </BreadcrumbLink>
                        </BreadcrumbItem>

                        {segments.map((segment) => {
                            if (segment === "dashboard") return null
                            return (
                                <div key={segment} className="flex items-center gap-2">
                                    <BreadcrumbSeparator className="transition-opacity animate-in fade-in duration-700" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage className="capitalize font-semibold text-primary/80 animate-in zoom-in-95 duration-300">
                                            {segment.replace("-", " ")}
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                </div>
                            )
                        })}
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* CENTER SECTION: Global search hub (CMD+K style) */}
            <div className="flex-1 max-w-md hidden lg:block transition-all hover:max-w-lg focus-within:max-w-lg duration-500">
                <GlobalSearch />
            </div>

            {/* RIGHT SECTION: Contextual actions and user status icons */}
            <div className="flex items-center gap-2 sm:gap-4">
                {/* Handling the notification bell loading state. 
                  We don't want the UI to jump around, so we use a smooth skeleton.
                */}
                {status === "loading" ? (
                    <Skeleton className="h-9 w-9 rounded-full animate-pulse" />
                ) : session?.user ? (
                    <div className="animate-in fade-in zoom-in duration-500">
                        <NotificationBell
                            userId={session.user.id!}
                            role={(session.user as any).role}
                        />
                    </div>
                ) : null}

                <Separator orientation="vertical" className="h-6 hidden sm:block opacity-50" />

                {/* Utility tools like Theme Switching */}
                <div className="flex items-center gap-2 transition-transform hover:rotate-3">
                    <ThemeToggle />
                </div>
            </div>
        </header>
    )
}