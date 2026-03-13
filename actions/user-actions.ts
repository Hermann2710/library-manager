'use server';

import { revalidatePath } from 'next/cache';
import User from '@/lib/models/User';
import dbConnect from '@/lib/mongodb';
import { auth } from '@/auth';

export async function getAllUsers() {
    try {
        await dbConnect();
        const session = await auth();
        
        // Sécurité : Seul l'admin peut lister tous les comptes
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

        await User.findByIdAndUpdate(userId, { role: newRole });
        
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

        // Empêcher de se supprimer soi-même
        if (session.user.id === userId) throw new Error("Vous ne pouvez pas supprimer votre propre compte");

        await User.findByIdAndDelete(userId);
        revalidatePath('/dashboard/admin/users');
        return { success: true };
    } catch (error) {
        throw new Error("Erreur lors de la suppression");
    }
}