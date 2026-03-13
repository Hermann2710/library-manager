"use server"

import dbConnect from "@/lib/mongodb";
import { Notification } from "@/lib/models/Notification";
import { revalidatePath } from "next/cache";

/**
 * Créer une notification (individuelle ou par rôle)
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
        
        // On revalide le layout pour que la cloche se mette à jour
        revalidatePath("/", "layout");
        return { success: true, data: JSON.parse(JSON.stringify(notification)) };
    } catch (error) {
        console.error("Erreur lors de la création de la notification:", error);
        return { success: false, error: "Erreur serveur" };
    }
}

/**
 * Récupérer les notifications d'un utilisateur (personnelles + liées à son rôle)
 */
export async function getMyNotifications(userId: string, role: string) {
    try {
        await dbConnect();
        const notifications = await Notification.find({
            $or: [
                { recipient: userId },
                { recipientRole: role }
            ]
        })
        .sort({ createdAt: -1 })
        .limit(30);

        return JSON.parse(JSON.stringify(notifications));
    } catch (error) {
        return [];
    }
}

/**
 * Compter les notifications non lues
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
 * Marquer une notification comme lue
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
 * Marquer TOUTES les notifications comme lues
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
 * Supprimer une notification
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