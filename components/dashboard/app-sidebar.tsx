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
    SidebarFooter
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronUp, User2, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";

export function AppSidebar() {
    const { data: session } = useSession();
    const role = session?.user?.role || "reader";
    const user = session?.user;

    const menuItems = DASHBOARD_CONFIG[role];

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="p-4 font-bold text-primary flex flex-row items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
                    LM
                </div>
                <span className="group-data-[collapsible=icon]:hidden">LibManager.ai</span>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {menuItems.map((item) => (
                            <SidebarMenuItem key={item.url}>
                                <SidebarMenuButton asChild tooltip={item.title}>
                                    <Link href={item.url}>
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            {/* Pied de page de la Sidebar avec le Dropdown Utilisateur */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                                    <User2 className="h-5 w-5" />
                                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                                        <span className="truncate font-semibold">{user?.name || "Utilisateur"}</span>
                                        <span className="truncate text-xs text-muted-foreground capitalize">{role}</span>
                                    </div>
                                    <ChevronUp className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                align="start"
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                            >
                                <DropdownMenuItem asChild className="cursor-pointer">
                                    <Link href="/dashboard/profile">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Mon Profil</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild className="cursor-pointer">
                                    <Link href="/dashboard/settings">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Paramètres</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive cursor-pointer"
                                    onClick={() => signOut({ callbackUrl: "/" })}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
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