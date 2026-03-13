import { getMyNotifications } from "@/actions/notification-actions";
import { NotificationsClient } from "@/components/dashboard/notifications/notification-client";

interface WrapperProps {
    userId: string;
    role: string;
}

export async function NotificationsListWrapper({ userId, role }: WrapperProps) {
    const notifications = await getMyNotifications(userId, role);

    return (
        <NotificationsClient
            initialNotifications={notifications}
            userId={userId}
            userRole={role}
        />
    );
}