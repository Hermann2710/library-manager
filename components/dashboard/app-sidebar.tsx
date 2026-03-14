"use client"

import { useSession, signOut } from "next-auth/react";
import { DASHBOARD_CONFIG } from "@/lib/dashboard-navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarGroup,
    SidebarFooter,
    SidebarGroupLabel
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronUp, User2, LogOut, User, Settings, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * AppSidebar Component.
 * This is the main navigation hub. It dynamically adjusts based on user roles
 * and ensures a smooth transition between expanded and collapsed states.
 */
export function AppSidebar() {
    // Grabbing session data to personalize the experience and enforce role-based access
    const { data: session } = useSession();
    const pathname = usePathname();

    // Safety first: fallback to 'reader' if no role is explicitly defined
    const role = session?.user?.role || "reader";
    const user = session?.user;

    // Load the specific navigation links for the current user's permissions
    const menuItems = DASHBOARD_CONFIG[role];

    return (
        <Sidebar collapsible="icon" className="border-r border-border/50 bg-card/50 backdrop-blur-xl">

            {/* Sidebar Branding:
                A clean, interactive logo area that links back to the landing page.
            */}
            <SidebarHeader className="pt-4">
                <Link
                    href="/"
                    className="flex items-center gap-3 font-bold group w-full"
                >
                    {/* The logo container with a nice gradient and a slight 'pop' on hover */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                        <Sparkles className="h-4 w-4 fill-current" />
                    </div>

                    {/* App title and platform label, hidden automatically in icon mode */}
                    <div className="flex flex-col leading-none truncate group-data-[collapsible=icon]:hidden transition-all duration-300">
                        <span className="text-lg tracking-tight whitespace-nowrap">
                            LibManager<span className="text-primary">.ai</span>
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-0.5 whitespace-nowrap">
                            Platform
                        </span>
                    </div>
                </Link>
            </SidebarHeader>

            <SidebarContent className="overflow-x-hidden">
                <SidebarGroup>
                    <SidebarGroupLabel className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/40 group-data-[collapsible=icon]:hidden">
                        Navigation
                    </SidebarGroupLabel>

                    <SidebarMenu className="gap-1">
                        {menuItems.map((item) => {
                            // Tracking the active route to give visual feedback to the user
                            const isActive = pathname === item.url;

                            return (
                                <SidebarMenuItem key={item.url}>
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={item.title}
                                        className={`h-10 px-2 transition-all duration-200 justify-start ${isActive
                                            ? "bg-primary/10 text-primary font-medium shadow-sm ring-1 ring-primary/20"
                                            : "hover:bg-sidebar-accent/50 text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        <Link href={item.url} className="flex items-center w-full">
                                            {/* shrink-0 is vital here to keep the icon perfectly centered when collapsed */}
                                            <item.icon className={`h-5 w-5 shrink-0 ${isActive ? "scale-105" : ""}`} />
                                            <span className="ml-3 truncate group-data-[collapsible=icon]:hidden">
                                                {item.title}
                                            </span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            );
                        })}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            {/* Sidebar Footer:
                Handles user profile context, settings, and the logout flow.
            */}
            <SidebarFooter className="p-2 border-t border-border/40">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="w-full rounded-xl hover:bg-sidebar-accent group data-[state=open]:bg-sidebar-accent px-2"
                                >
                                    {/* Using the user's initial as a lightweight, clean avatar */}
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary font-bold shadow-inner">
                                        {user?.name?.charAt(0) || <User2 className="h-4 w-4" />}
                                    </div>

                                    {/* Profile info, neatly tucked away in icon mode */}
                                    <div className="grid flex-1 text-left text-sm leading-tight ml-3 truncate group-data-[collapsible=icon]:hidden">
                                        <span className="truncate font-semibold">{user?.name || "Utilisateur"}</span>
                                        <span className="truncate text-[10px] text-muted-foreground/80 capitalize">{role}</span>
                                    </div>

                                    <ChevronUp className="ml-auto h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden transition-transform" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>

                            {/* Positioning the dropdown to the side for better UX in icon mode */}
                            <DropdownMenuContent
                                side="right"
                                align="end"
                                className="w-56 rounded-xl p-2 shadow-xl border-border/50 backdrop-blur-lg ml-2"
                            >
                                <DropdownMenuItem asChild className="rounded-lg cursor-pointer py-2">
                                    <Link href="/dashboard/profile" className="flex items-center">
                                        <User className="mr-3 h-4 w-4 text-muted-foreground" />
                                        <span>Mon Profil</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-2 bg-border/50" />
                                <DropdownMenuItem
                                    className="rounded-lg text-destructive focus:text-destructive focus:bg-destructive/10 cursor-pointer py-2"
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                >
                                    <LogOut className="mr-3 h-4 w-4" />
                                    <span>Déconnexion</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}