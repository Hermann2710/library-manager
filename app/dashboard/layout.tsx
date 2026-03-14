import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

/**
 * DashboardLayout Component.
 * Acts as the private shell for authenticated users.
 * Manages the sidebar state, authentication session, and provides a consistent internal UI.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            {/* SidebarProvider: Manages the open/closed state of the AppSidebar.
                'defaultOpen' ensures a robust desktop experience out of the box.
            */}
            <SidebarProvider defaultOpen={true}>

                {/* Fixed Navigation: Stays on the left, handles main dashboard sections. */}
                <AppSidebar />

                {/* SidebarInset: The main content wrapper that adjusts based on sidebar state. */}
                <SidebarInset className="flex flex-col min-h-screen bg-background">

                    {/* Sticky Header: Contains user profile, search, and notifications. */}
                    <DashboardHeader />

                    {/* Main Content Area:
                        - 'flex-1': Fills the remaining vertical space.
                        - 'overflow-y-auto': Enables independent scrolling from the sidebar.
                        - 'p-4 md:p-6 lg:p-8': Progressive padding for a professional feel.
                        - 'max-w-7xl': Prevents content from stretching too far on ultra-wide screens.
                    */}
                    <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 animate-in fade-in duration-500">
                        <div className="mx-auto max-w-7xl w-full">
                            {children}
                        </div>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </>
    );
}