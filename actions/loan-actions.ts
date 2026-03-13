'use server';

import { revalidatePath } from 'next/cache';
import { Loan } from '@/lib/models/Loan';
import { Item } from '@/lib/models/Item';
import { Member } from '@/lib/models/Member';
import dbConnect from '@/lib/mongodb';
import { auth } from '@/auth';
import { loanSchema } from '@/lib/validation/loan';

/**
 * RÉCUPÉRER TOUS LES EMPRUNTS
 */
export async function getLoans() {
    try {
        await dbConnect();
        const loans = await Loan.find()
            .populate({ path: 'item', populate: { path: 'work', select: 'title' }})
            .populate({ path: 'member', populate: { path: 'user', select: 'name email' }})
            .sort({ createdAt: -1 });
        return JSON.parse(JSON.stringify(loans));
    } catch (error) {
        throw new Error("Erreur de chargement des emprunts");
    }
}

/**
 * INITIALISER UN EMPRUNT (LECTEUR : RÉSERVATION)
 */
export async function reserveItem(itemId: string) {
    try {
        await dbConnect();
        const session = await auth();
        if (!session) throw new Error("Vous devez être connecté");

        // 1. Trouver le membre lié à l'utilisateur
        const member = await Member.findOne({ user: session.user.id });
        if (!member) throw new Error("Profil membre introuvable");

        // 2. Vérifications (Banni, Expiré, Limite de 3)
        if (member.status !== "Active") throw new Error("Votre compte n'est pas actif");
        if (new Date(member.membershipExpiresAt) < new Date()) throw new Error("Votre adhésion a expiré");

        const activeCount = await Loan.countDocuments({ member: member._id, status: { $in: ["Active", "Pending"] } });
        if (activeCount >= 3) throw new Error("Vous avez atteint la limite de 3 livres (emprunts + réservations)");

        // 3. Vérifier l'exemplaire
        const item = await Item.findById(itemId);
        if (!item || item.status !== "Available") throw new Error("Exemplaire non disponible");

        // 4. Création en statut 'Pending'
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);

        await Loan.create({
            item: itemId,
            member: member._id,
            librarian: "65f123456789..." , // ID temporaire ou null tant que non validé
            status: "Pending",
            dueDate
        });

        await Item.findByIdAndUpdate(itemId, { status: "Reserved" });

        revalidatePath('/dashboard');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

/**
 * VALIDER UN EMPRUNT (BIBLIOTHÉCAIRE)
 */
export async function validateLoan(loanId: string) {
    try {
        await dbConnect();
        const session = await auth();
        if (!session || session.user.role === "reader") throw new Error("Action non autorisée");

        const loan = await Loan.findById(loanId);
        if (!loan) throw new Error("Emprunt introuvable");

        loan.status = "Active";
        loan.borrowDate = new Date();
        loan.librarian = session.user.id;
        await loan.save();

        await Item.findByIdAndUpdate(loan.item, { status: "Borrowed" });

        revalidatePath('/dashboard/librarian/loans');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

/**
 * RETOUR DE LIVRE
 */
export async function returnItem(loanId: string) {
    try {
        await dbConnect();
        const loan = await Loan.findById(loanId);
        await Loan.findByIdAndUpdate(loanId, { status: "Returned", returnDate: new Date() });
        await Item.findByIdAndUpdate(loan.item, { status: "Available" });

        revalidatePath('/dashboard/librarian/loans');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}