'use server';

import { revalidatePath } from 'next/cache';
import User from '@/lib/models/User';
import dbConnect from '@/lib/mongodb';
import { auth } from '@/auth';
import { createNotification } from '@/actions/notification-actions';

/**
 * Fetches the entire list of registered users.
 * Strictly restricted to users with the 'admin' role to ensure data privacy.
 */
export async function getAllUsers() {
    try {
        await dbConnect();
        const session = await auth();
        
        // Identity check: Only admins can view the global user list
        if (session?.user?.role !== "admin") {
            throw new Error("Accès non autorisé");
        }

        const users = await User.find().sort({ createdAt: -1 });
        return JSON.parse(JSON.stringify(users));
    } catch (error) {
        throw new Error("Erreur lors de la récupération des utilisateurs");
    }
}

/**
 * Updates a user's permissions (role).
 * Essential for promoting members to librarians or admins.
 * Sends alerts to the concerned user and logs the action for other admins.
 */
export async function updateUserRole(userId: string, newRole: string) {
    try {
        await dbConnect();
        const session = await auth();
        
        if (session?.user?.role !== "admin") throw new Error("Action interdite");

        const updatedUser = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });
        
        // High-priority alert: The user needs to know their access level has changed
        await createNotification({
            recipient: userId,
            title: "🔑 Vos permissions ont changé",
            message: `Votre rôle a été mis à jour. Vous êtes désormais : ${newRole}.`,
            type: "system",
            priority: "high",
            link: "/dashboard"
        });

        // Audit Trail: Notify other admins about this administrative action
        await createNotification({
            recipientRole: "admin",
            title: "🛡️ Changement de rôle",
            message: `${session.user.name} a promu/rétrogradé ${updatedUser.name} au rang de ${newRole}.`,
            type: "system",
            priority: "medium"
        });

        revalidatePath('/dashboard/admin/users');
        return { success: true };
    } catch (error) {
        throw new Error("Erreur lors du changement de rôle");
    }
}

/**
 * Permanently deletes a user account.
 * Includes safety checks to prevent admins from accidentally deleting themselves.
 */
export async function deleteUserAccount(userId: string) {
    try {
        await dbConnect();
        const session = await auth();
        
        if (session?.user?.role !== "admin") throw new Error("Action interdite");

        // Self-deletion guardrail
        if (session.user.id === userId) throw new Error("Vous ne pouvez pas supprimer votre propre compte");

        const userToDelete = await User.findById(userId);

        // Notify admins about the account closure for traceability
        if (userToDelete) {
            await createNotification({
                recipientRole: "admin",
                title: "🚨 Compte supprimé",
                message: `Le compte de ${userToDelete.name} (${userToDelete.email}) a été définitivement supprimé par ${session.user.name}.`,
                type: "system",
                priority: "high"
            });
        }

        await User.findByIdAndDelete(userId);
        revalidatePath('/dashboard/admin/users');
        return { success: true };
    } catch (error) {
        throw new Error("Erreur lors de la suppression");
    }
}

/**
 * Allows a user to update their own profile information.
 * Synchronizes the changes and triggers a UI refresh for the session data.
 */
export async function updateProfile(values: { name: string; email: string; image?: string }) {
    try {
        await dbConnect();
        const session = await auth();
        
        if (!session?.user?.id) throw new Error("Vous devez être connecté");

        const updatedUser = await User.findByIdAndUpdate(
            session.user.id, 
            { 
                name: values.name, 
                email: values.email, 
                image: values.image 
            }, 
            { new: true }
        );

        // Immediate feedback to the user confirming their changes were saved
        await createNotification({
            recipient: session.user.id,
            title: "👤 Profil mis à jour",
            message: "Vos informations personnelles ont été modifiées avec succès.",
            type: "system",
            priority: "low"
        });

        revalidatePath('/dashboard/profile');
        return { success: true, user: JSON.parse(JSON.stringify(updatedUser)) };
    } catch (error: any) {
        throw new Error(error.message || "Erreur lors de la mise à jour du profil");
    }
}