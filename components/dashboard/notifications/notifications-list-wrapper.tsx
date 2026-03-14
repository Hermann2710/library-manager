import { getMyNotifications } from "@/actions/notification-actions";
import { NotificationsClient } from "@/components/dashboard/notifications/notification-client";

interface WrapperProps {
    userId: string;
    role: string;
}

/**
 * NotificationsListWrapper Component (Server-Side).
 * * This component acts as a data bridge. It performs the initial server-side 
 * fetch to ensure that the user sees their notifications immediately on load 
 * (SEO & Performance friendly), then passes that data to the Client Component 
 * for real-time interactions.
 */
export async function NotificationsListWrapper({ userId, role }: WrapperProps) {
    /**
     * Data Hydration:
     * We fetch notifications based on both userId (for personal alerts) 
     * and role (for staff/admin broadcast alerts).
     */
    const notifications = await getMyNotifications(userId, role);

    return (
        /* We hand over the 'initialNotifications' to the client component.
           This allows the UI to be interactive (marking as read, deleting) 
           without a full page refresh.
        */
        <NotificationsClient
            initialNotifications={notifications}
            userId={userId}
            userRole={role}
        />
    );
}