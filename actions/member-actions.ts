'use server';

import { revalidatePath } from 'next/cache';
import { Member } from '@/lib/models/Member';
import User from '@/lib/models/User'; 
import dbConnect from '@/lib/mongodb';
import { memberSchema } from '@/lib/validation/member';

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

        // Vérifier si l'utilisateur a déjà une fiche membre
        const existingMember = await Member.findOne({ user: validatedData.user });
        if (existingMember) throw new Error("Cet utilisateur est déjà membre");

        // Génération du Member ID (ex: MEM-2026-0001)
        const count = await Member.countDocuments();
        const memberId = `MEM-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

        const newMember = await Member.create({
            ...validatedData,
            memberId
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

        const updatedMember = await Member.findByIdAndUpdate(
            id, 
            { ...validatedData }, 
            { new: true }
        );

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
        // TODO: Vérifier s'il n'a pas d'emprunts en cours avant de supprimer
        await Member.findByIdAndDelete(id);
        revalidatePath('/dashboard/librarian/members');
        return { success: true };
    } catch (error) {
        throw new Error("Erreur lors de la suppression du membre");
    }
}

/**
 * Récupère les utilisateurs qui n'ont pas encore de fiche membre
 * Utile pour le Select du formulaire de création
 */
export async function getAvailableUsers() {
    await dbConnect();
    const members = await Member.find().select('user');
    const memberUserIds = members.map(m => m.user);
    
    // On cherche les users qui ne sont pas dans la liste des membres
    const users = await User.find({ _id: { $nin: memberUserIds } }).select('name email');
    return JSON.parse(JSON.stringify(users));
}