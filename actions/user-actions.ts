'use server';

import { revalidatePath } from 'next/cache';
import User from '@/lib/models/User';
import dbConnect from '@/lib/mongodb';
import { auth } from '@/auth';
import { createNotification } from '@/actions/notification-actions';

export async function getAllUsers() {
    try {
        await dbConnect();
        const session = await auth();
        
        if (session?.user?.role !== "admin") {
            throw new Error("Accès non autorisé");
        }

        const users = await User.find().sort({ createdAt: -1 });
        return JSON.parse(JSON.stringify(users));
    } catch (error) {
        throw new Error("Erreur lors de la récupération des utilisateurs");
    }
}

export async function updateUserRole(userId: string, newRole: string) {
    try {
        await dbConnect();
        const session = await auth();
        
        if (session?.user?.role !== "admin") throw new Error("Action interdite");

        const updatedUser = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });
        
        // 🔔 Notification pour l'utilisateur concerné
        await createNotification({
            recipient: userId,
            title: "🔑 Vos permissions ont changé",
            message: `Votre rôle a été mis à jour. Vous êtes désormais : ${newRole}.`,
            type: "system",
            priority: "high",
            link: "/dashboard"
        });

        // 🔔 Notification pour les autres Admins (Audit)
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

export async function deleteUserAccount(userId: string) {
    try {
        await dbConnect();
        const session = await auth();
        
        if (session?.user?.role !== "admin") throw new Error("Action interdite");

        if (session.user.id === userId) throw new Error("Vous ne pouvez pas supprimer votre propre compte");

        const userToDelete = await User.findById(userId);

        // 🔔 Notification pour les autres Admins (Trace de suppression)
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

        // Optionnel : Notifier l'utilisateur du succès de la modification
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