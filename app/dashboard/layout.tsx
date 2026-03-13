import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/header";
import { SessionProvider } from "next-auth/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <SidebarProvider defaultOpen={true}>
                {/* La sidebar reste à gauche */}
                <AppSidebar />

                <SidebarInset className="flex flex-col min-h-screen bg-background">
                    {/* Le Header est sticky, il doit être en haut de l'inset */}
                    <DashboardHeader />

                    {/* Le "main" contient le padding uniforme (p-4 ou p-6).
                      On ajoute flex-1 pour qu'il prenne tout l'espace restant.
                    */}
                    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                        <div className="mx-auto max-w-7xl w-full">
                            {children}
                        </div>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </SessionProvider>
    );
}