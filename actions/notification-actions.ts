"use server"

import dbConnect from "@/lib/mongodb";
import { Notification } from "@/lib/models/Notification";
import { revalidatePath } from "next/cache";

/**
 * Dispatches a new notification to a specific user or an entire staff group.
 * This is the engine behind all the alerts seen in the library's modules.
 */
export async function createNotification(params: {
    recipient?: string;
    recipientRole?: "reader" | "librarian" | "admin";
    title: string;
    message: string;
    type: "loan" | "reminder" | "system" | "inventory";
    priority?: "low" | "medium" | "high";
    link?: string;
}) {
    try {
        await dbConnect();
        const notification = await Notification.create(params);
        
        // We revalidate the entire layout to ensure the notification bell 
        // badge updates instantly across the dashboard.
        revalidatePath("/", "layout");
        return { success: true, data: JSON.parse(JSON.stringify(notification)) };
    } catch (error) {
        console.error("Erreur lors de la création de la notification:", error);
        return { success: false, error: "Erreur serveur" };
    }
}

/**
 * Retrieves the notification feed for a logged-in user.
 * It intelligently merges private messages and role-based announcements.
 */
export async function getMyNotifications(userId: string, role: string) {
    try {
        await dbConnect();
        const notifications = await Notification.find({
            $or: [
                { recipient: userId }, // Private alerts
                { recipientRole: role } // Global staff/reader alerts
            ]
        })
        .sort({ createdAt: -1 }) // Show the freshest news first
        .limit(30); // Keep the feed fast and lightweight

        return JSON.parse(JSON.stringify(notifications));
    } catch (error) {
        return [];
    }
}

/**
 * Calculates the number of unread alerts for the current session.
 * Essential for displaying the numeric badge on the sidebar's bell icon.
 */
export async function getUnreadCount(userId: string, role: string) {
    try {
        await dbConnect();
        const count = await Notification.countDocuments({
            $or: [
                { recipient: userId },
                { recipientRole: role }
            ],
            isRead: false
        });
        return count;
    } catch (error) {
        return 0;
    }
}

/**
 * Flags a specific notification as 'seen'.
 * Triggers a layout refresh to decrement the unread badge count immediately.
 */
export async function markAsRead(notificationId: string) {
    try {
        await dbConnect();
        await Notification.findByIdAndUpdate(notificationId, { isRead: true });
        revalidatePath("/", "layout");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

/**
 * Bulk-clears all unread messages for a user.
 * Perfect for the "Mark all as read" button in the notification panel.
 */
export async function markAllAsRead(userId: string, role: string) {
    try {
        await dbConnect();
        await Notification.updateMany(
            {
                $or: [ { recipient: userId }, { recipientRole: role } ],
                isRead: false
            },
            { isRead: true }
        );
        revalidatePath("/", "layout");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}

/**
 * Permanently removes an alert from the user's feed.
 */
export async function deleteNotification(notificationId: string) {
    try {
        await dbConnect();
        await Notification.findByIdAndDelete(notificationId);
        revalidatePath("/", "layout");
        return { success: true };
    } catch (error) {
        return { success: false };
    }
}