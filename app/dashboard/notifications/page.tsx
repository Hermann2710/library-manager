import { auth } from "@/auth";
import { getMyNotifications } from "@/actions/notification-actions";
import { BellRing } from "lucide-react";
import { NotificationsClient } from "@/components/dashboard/notifications/notification-client";

export default async function NotificationsPage() {
    const session = await auth();

    if (!session?.user) return null;

    // Récupération initiale des données
    const notifications = await getMyNotifications(
        session.user.id!,
        (session.user as any).role
    );

    return (
        <div className="container mx-auto py-8 px-4 max-w-5xl">
            <div className="flex items-center gap-3 mb-8">
                <div className="bg-primary/10 p-2 rounded-lg">
                    <BellRing className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Centre de notifications</h1>
                    <p className="text-muted-foreground">
                        Gérez vos alertes et l'historique de vos activités.
                    </p>
                </div>
            </div>

            <NotificationsClient
                initialNotifications={notifications}
                userId={session.user.id}
                userRole={(session.user as any).role}
            />
        </div>
    );
}