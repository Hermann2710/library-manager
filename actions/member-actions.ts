'use server';

import { revalidatePath } from 'next/cache';
import { Member } from '@/lib/models/Member';
import User from '@/lib/models/User'; 
import dbConnect from '@/lib/mongodb';
import { memberSchema } from '@/lib/validation/member';
import { createNotification } from '@/actions/notification-actions';

/**
 * Retrieves the complete list of library members.
 * We populate the 'user' data to display names, emails, and profile pictures 
 * alongside their specific membership details.
 */
export async function getMembers() {
    try {
        await dbConnect();
        const members = await Member.find()
            .populate({ path: 'user', select: 'name email image' })
            .sort({ createdAt: -1 });
            
        // Clean output for Next.js Client Components
        return JSON.parse(JSON.stringify(members));
    } catch (error) {
        console.error("Erreur getMembers:", error);
        throw new Error("Impossible de charger la liste des membres");
    }
}

/**
 * Fetches a single member's profile by their unique MongoDB ID.
 * Useful for the detailed member view or edit forms.
 */
export async function getMemberById(id: string) {
    await dbConnect();
    const member = await Member.findById(id).populate('user');
    return JSON.parse(JSON.stringify(member));
}

/**
 * Manually creates a membership record for an existing authenticated user.
 * Generates a structured Member ID (e.g., MEM-2026-0001) for library tracking.
 */
export async function createMember(data: any) {
    try {
        await dbConnect();
        const validatedData = memberSchema.parse(data);

        // One identity = one membership. We prevent duplicate member files for the same user.
        const existingMember = await Member.findOne({ user: validatedData.user });
        if (existingMember) throw new Error("Cet utilisateur est déjà membre");

        const count = await Member.countDocuments();
        const memberId = `MEM-${new Date().getFullYear()}-${(count + 1).toString().padStart(4, '0')}`;

        const newMember = await Member.create({
            ...validatedData,
            memberId
        });

        // Notify the user that their membership card is now active and ready to use
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
 * Updates membership details such as status, phone number, or expiration date.
 * Includes logic to notify the user if their status changes (e.g., if they are banned).
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

        // Crucial feedback: Alert the user if their access status changes
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
 * Removes a member record from the system.
 * High-priority notification for admins since this affects access rights.
 */
export async function deleteMember(id: string) {
    try {
        await dbConnect();
        const memberToDelete = await Member.findById(id).populate('user', 'name');
        
        if (memberToDelete) {
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
 * Identifies users who have an account but no library membership yet.
 * Perfect for the "Add Member" dropdown to avoid redundant entries.
 */
export async function getAvailableUsers() {
    await dbConnect();
    // Get IDs of everyone who is already a member
    const members = await Member.find().select('user');
    const memberUserIds = members.map(m => m.user);
    
    // Find users NOT in that list
    const users = await User.find({ _id: { $nin: memberUserIds } }).select('name email');
    return JSON.parse(JSON.stringify(users));
}