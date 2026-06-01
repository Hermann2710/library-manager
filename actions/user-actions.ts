'use server';

import { revalidatePath } from 'next/cache';
import User from '@/lib/models/User';
import dbConnect from '@/lib/mongodb';
import { auth } from '@/auth';
import { createNotification } from '@/actions/notification-actions';
import { isRole } from '@/lib/access-control';
import { assertRole } from '@/lib/rbac';

function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error ? error.message : fallback;
}

export async function getAllUsers() {
    try {
        await dbConnect();
        await assertRole(["admin"]);

        const users = await User.find()
            .select("name email image role createdAt updatedAt")
            .sort({ createdAt: -1 })
            .lean();

        return JSON.parse(JSON.stringify(users));
    } catch {
        throw new Error("Erreur lors de la recuperation des utilisateurs");
    }
}

export async function updateUserRole(userId: string, newRole: string) {
    try {
        await dbConnect();
        const session = await assertRole(["admin"]);

        if (!isRole(newRole)) {
            throw new Error("Role invalide");
        }

        const updatedUser = await User.findByIdAndUpdate(userId, { role: newRole }, { new: true });

        if (!updatedUser) {
            throw new Error("Utilisateur introuvable");
        }

        await createNotification({
            recipient: userId,
            title: "Permissions modifiees",
            message: `Votre role a ete mis a jour. Vous etes desormais : ${newRole}.`,
            type: "system",
            priority: "high",
            link: "/dashboard"
        });

        await createNotification({
            recipientRole: "admin",
            title: "Changement de role",
            message: `${session.user.name} a modifie le role de ${updatedUser.name} en ${newRole}.`,
            type: "system",
            priority: "medium"
        });

        revalidatePath('/dashboard/admin/users');
        return { success: true };
    } catch (error: unknown) {
        throw new Error(getErrorMessage(error, "Erreur lors du changement de role"));
    }
}

export async function deleteUserAccount(userId: string) {
    try {
        await dbConnect();
        const session = await assertRole(["admin"]);

        if (session.user.id === userId) {
            throw new Error("Vous ne pouvez pas supprimer votre propre compte");
        }

        const userToDelete = await User.findById(userId).select("name email").lean();

        if (userToDelete) {
            await createNotification({
                recipientRole: "admin",
                title: "Compte supprime",
                message: `Le compte de ${userToDelete.name} (${userToDelete.email}) a ete definitivement supprime par ${session.user.name}.`,
                type: "system",
                priority: "high"
            });
        }

        await User.findByIdAndDelete(userId);
        revalidatePath('/dashboard/admin/users');
        return { success: true };
    } catch (error: unknown) {
        throw new Error(getErrorMessage(error, "Erreur lors de la suppression"));
    }
}

export async function updateProfile(values: { name: string; email: string; image?: string }) {
    try {
        await dbConnect();
        const session = await auth();

        if (!session?.user?.id) throw new Error("Vous devez etre connecte");

        const updatedUser = await User.findByIdAndUpdate(
            session.user.id,
            {
                name: values.name,
                email: values.email,
                image: values.image
            },
            { new: true }
        );

        await createNotification({
            recipient: session.user.id,
            title: "Profil mis a jour",
            message: "Vos informations personnelles ont ete modifiees avec succes.",
            type: "system",
            priority: "low"
        });

        revalidatePath('/dashboard/profile');
        return { success: true, user: JSON.parse(JSON.stringify(updatedUser)) };
    } catch (error: unknown) {
        throw new Error(getErrorMessage(error, "Erreur lors de la mise a jour du profil"));
    }
}
