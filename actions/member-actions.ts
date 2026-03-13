'use server';

import { revalidatePath } from 'next/cache';
import { Member } from '@/lib/models/Member';
import User from '@/lib/models/User'; 
import dbConnect from '@/lib/mongodb';
import { memberSchema } from '@/lib/validation/member';
import { createNotification } from '@/actions/notification-actions';

/**
 * Récupère la liste de tous les membres avec les infos User liées
 */
export async function getMembers() {
    try {
        await dbConnect();
        const members = await Member.find()
            .populate({ path: 'user', select: 'name email image' })
            .sort({ createdAt: -1 });
        return JSON.parse(JSON.stringify(members));
    } catch (error) {
        console.error("Erreur getMembers:", error);
        throw new Error("Impossible de charger la liste des membres");
    }
}

/**
 * Récupère un membre spécifique par son ID ou l'ID de l'utilisateur
 */
export async function getMemberById(id: string) {
    await dbConnect();
    const member = await Member.findById(id).populate('user');
    return JSON.parse(JSON.stringify(member));
}

/**
 * Crée une fiche membre pour un utilisateur existant
 */
export async function createMember(data: any) {
    try {
        await dbConnect();
        const validatedData = memberSchema.parse(data);

        const existingMember = await Member.findOne({ user: validatedData.user });
        if (existingMember) throw new Error("Cet utilisateur est déjà membre");

        const count = await Member.countDocuments();
        const memberId = `MEM-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

        const newMember = await Member.create({
            ...validatedData,
            memberId
        });

        // 🔔 Notification pour le nouvel utilisateur
        await createNotification({
            recipient: validatedData.user,
            title: "🎟️ Carte de membre activée",
            message: `Votre fiche membre (${memberId}) a été créée par l'administration.`,
            type: "system",
            priority: "medium",
            link: "/dashboard/profile"
        });

        revalidatePath('/dashboard/librarian/members');
        return JSON.parse(JSON.stringify(newMember));
    } catch (error: any) {
        throw new Error(error.message || "Erreur lors de la création");
    }
}

/**
 * Met à jour les infos d'un membre (statut, téléphone, expiration)
 */
export async function updateMember(id: string, data: any) {
    try {
        await dbConnect();
        const validatedData = memberSchema.parse(data);

        const oldMember = await Member.findById(id);
        const updatedMember = await Member.findByIdAndUpdate(
            id, 
            { ...validatedData }, 
            { new: true }
        );

        // 🔔 Notification si le STATUT a changé (ex: Banned ou Inactive)
        if (oldMember.status !== updatedMember.status) {
            await createNotification({
                recipient: updatedMember.user.toString(),
                title: "⚠️ Statut de votre compte mis à jour",
                message: `Le statut de votre adhésion est désormais : ${updatedMember.status}.`,
                type: "system",
                priority: updatedMember.status === "Banned" ? "high" : "medium",
                link: "/dashboard/profile"
            });
        }

        revalidatePath('/dashboard/librarian/members');
        return JSON.parse(JSON.stringify(updatedMember));
    } catch (error: any) {
        throw new Error(error.message || "Erreur lors de la mise à jour");
    }
}

/**
 * Supprime une fiche membre
 */
export async function deleteMember(id: string) {
    try {
        await dbConnect();
        const memberToDelete = await Member.findById(id).populate('user', 'name');
        
        if (memberToDelete) {
            // 🔔 Alerte Admin car c'est une action radicale
            await createNotification({
                recipientRole: "admin",
                title: "🚨 Fiche membre supprimée",
                message: `La fiche de ${(memberToDelete.user as any).name} (${memberToDelete.memberId}) a été supprimée.`,
                type: "system",
                priority: "high"
            });
        }

        await Member.findByIdAndDelete(id);
        revalidatePath('/dashboard/librarian/members');
        return { success: true };
    } catch (error) {
        throw new Error("Erreur lors de la suppression du membre");
    }
}

/**
 * Récupère les utilisateurs qui n'ont pas encore de fiche membre
 */
export async function getAvailableUsers() {
    await dbConnect();
    const members = await Member.find().select('user');
    const memberUserIds = members.map(m => m.user);
    const users = await User.find({ _id: { $nin: memberUserIds } }).select('name email');
    return JSON.parse(JSON.stringify(users));
}