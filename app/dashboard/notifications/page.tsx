import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { BellRing, Loader2 } from "lucide-react";
import { DashboardContainer } from "@/components/shared/dashboard-container";
import { NotificationsListWrapper } from "@/components/dashboard/notifications/notifications-list-wrapper";

/**
 * NotificationsPage: The central hub for user alerts and activity history.
 * It uses a Suspense boundary to decouple the page shell from the 
 * data-heavy notification fetching logic.
 */
export default async function NotificationsPage() {
    // Ensuring the user is authenticated on the server before rendering the page shell
    const session = await auth();
    if (!session?.user) redirect("/login");

    return (
        <DashboardContainer
            title="Centre de notifications"
            subtitle="Alertes"
            description="Gérez vos alertes de retour, rappels et l'historique de vos activités."
            actions={
                /* Branding element: Pulsing icon to signify an active notification center */
                <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20 shadow-sm shadow-primary/5">
                    <BellRing className="h-5 w-5 text-primary" />
                </div>
            }
        >
            {/* Suspense Boundary:
                This allows the 'DashboardContainer' to render immediately while 
                'NotificationsListWrapper' fetches notifications from the database.
                The key helps React track the component's state during re-renders.
            */}
            <Suspense
                fallback={
                    /* A clean, "Premium" fallback that matches the site's aesthetic */
                    <div className="flex flex-col items-center justify-center py-32 gap-6 bg-muted/20 backdrop-blur-sm rounded-[2.5rem] border border-dashed border-border/60 animate-in fade-in duration-500">
                        <div className="relative">
                            <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
                            <BellRing className="h-4 w-4 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60" />
                        </div>
                        <div className="space-y-1 text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                                Synchronisation
                            </p>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40 italic">
                                Chargement de vos alertes en temps réel...
                            </p>
                        </div>
                    </div>
                }
            >
                {/* The Wrapper:
                    Acts as a bridge between the Server Page and the Client Components. 
                    It passes necessary session data to trigger targeted Server Actions.
                */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <NotificationsListWrapper
                        userId={session.user.id!}
                        role={(session.user as any).role}
                    />
                </div>
            </Suspense>
        </DashboardContainer>
    );
}