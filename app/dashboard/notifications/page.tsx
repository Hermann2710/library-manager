import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { BellRing, Loader2 } from "lucide-react";
import { DashboardContainer } from "@/components/shared/dashboard-container";
import { NotificationsListWrapper } from "@/components/dashboard/notifications/notifications-list-wrapper";

export default async function NotificationsPage() {
    const session = await auth();
    if (!session?.user) redirect("/login");

    return (
        <DashboardContainer
            title="Centre de notifications"
            subtitle="Alertes"
            description="Gérez vos alertes de retour, rappels et l'historique de vos activités."
            actions={
                <div className="bg-primary/10 p-2 rounded-lg">
                    <BellRing className="h-5 w-5 text-primary" />
                </div>
            }
        >
            {/* Le Suspense enveloppe le Wrapper qui fait l'appel aux actions (Server Actions).
                On utilise une clé basée sur le temps ou l'ID si on veut forcer le refresh.
            */}
            <Suspense
                fallback={
                    <div className="flex flex-col items-center justify-center py-20 gap-4 bg-muted/5 rounded-3xl border border-dashed">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                            Synchronisation des alertes...
                        </p>
                    </div>
                }
            >
                <NotificationsListWrapper
                    userId={session.user.id!}
                    role={(session.user as any).role}
                />
            </Suspense>
        </DashboardContainer>
    );
}