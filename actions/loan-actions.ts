'use server';

import { revalidatePath } from 'next/cache';
import { Loan } from '@/lib/models/Loan';
import { Item } from '@/lib/models/Item';
import { Member } from '@/lib/models/Member';
import { Work } from '@/lib/models/Work';
import dbConnect from '@/lib/mongodb';
import { auth } from '@/auth';
import { createNotification } from '@/actions/notification-actions';

/**
 * Fetches all loan records, including current, past, and pending ones.
 * We use nested population to get the book title and the member's identity 
 * for a comprehensive management view.
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
 * Triggered when a reader wants to reserve a book.
 * Handles strict business logic: membership validity, active loan limits, 
 * and item availability.
 */
export async function reserveItem(itemId: string) {
    try {
        await dbConnect();
        const session = await auth();
        if (!session) throw new Error("Vous devez être connecté");

        // Verify the member's profile and active status
        const member = await Member.findOne({ user: session.user.id }).populate('user', 'name');
        if (!member) throw new Error("Profil membre introuvable");

        if (member.status !== "Active") throw new Error("Votre compte n'est pas actif");
        
        // Ensure the membership hasn't expired
        if (member.membershipExpiresAt && new Date(member.membershipExpiresAt) < new Date()) {
            throw new Error("Votre adhésion a expiré");
        }

        // Enforcement of the '3-books-max' policy
        const activeCount = await Loan.countDocuments({ 
            member: member._id, 
            status: { $in: ["Active", "Pending"] } 
        });
        
        if (activeCount >= 3) throw new Error("Limite de 3 livres atteinte");

        // Verify the specific physical copy is actually on the shelf
        const item = await Item.findById(itemId).populate('work', 'title');
        if (!item || item.status !== "Available") throw new Error("Exemplaire non disponible");

        // Set the standard 14-day return window
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 14);

        const newLoan = await Loan.create({
            item: itemId,
            member: member._id,
            status: "Pending",
            dueDate
        });

        // Mark the item as reserved so no one else can grab it
        await Item.findByIdAndUpdate(itemId, { status: "Reserved" });

        // Alert the staff to prepare the book for pickup
        await createNotification({
            recipientRole: "librarian",
            title: "⏳ Nouvelle réservation",
            message: `${(member.user as any).name} a réservé "${(item.work as any).title}".`,
            type: "loan",
            priority: "medium",
            link: "/dashboard/librarian/loans"
        });

        revalidatePath('/dashboard/search');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

/**
 * Allows a reader to change their mind and release a reserved book.
 * Restores the item status to 'Available' and cleans up the loan entry.
 */
export async function cancelReservation(loanId: string) {
    try {
        await dbConnect();
        const session = await auth();
        if (!session) throw new Error("Non autorisé");

        const loan = await Loan.findById(loanId).populate({ path: 'item', populate: { path: 'work', select: 'title' }});
        if (!loan) throw new Error("Réservation introuvable");

        const member = await Member.findOne({ user: session.user.id }).populate('user', 'name');
        if (!member || loan.member.toString() !== member._id.toString()) {
            throw new Error("Action non autorisée");
        }

        // Safety: Prevent canceling loans that are already active/borrowed
        if (loan.status !== "Pending") throw new Error("Seules les réservations en attente peuvent être annulées");

        await Item.findByIdAndUpdate(loan.item, { status: "Available" });
        await Loan.findByIdAndDelete(loanId);

        await createNotification({
            recipientRole: "librarian",
            title: "🚫 Réservation annulée",
            message: `${(member.user as any).name} a annulé sa réservation pour "${(loan.item as any).work.title}".`,
            type: "loan",
            priority: "low"
        });

        revalidatePath('/dashboard/my-loans');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

/**
 * Confirms the hand-over of the book from librarian to reader.
 * Changes the status from 'Pending' to 'Active'.
 */
export async function validateLoan(loanId: string) {
    try {
        await dbConnect();
        const session = await auth();
        // Permission check: only staff/admins can validate a hand-over
        if (!session || session.user.role === "reader") throw new Error("Action non autorisée");

        const loan = await Loan.findById(loanId)
            .populate({ path: 'item', populate: { path: 'work', select: 'title' }})
            .populate('member');
            
        if (!loan) throw new Error("Emprunt introuvable");

        loan.status = "Active";
        loan.borrowDate = new Date();
        loan.librarian = session.user.id; // Track which staff member handled this
        await loan.save();

        await Item.findByIdAndUpdate(loan.item._id, { status: "Borrowed" });

        // Notify the reader that their loan window has officially started
        await createNotification({
            recipient: (loan.member as any).user.toString(),
            title: "📖 Emprunt validé !",
            message: `Votre emprunt pour "${(loan.item as any).work.title}" est actif. À rendre avant le ${new Date(loan.dueDate).toLocaleDateString()}.`,
            type: "loan",
            priority: "high",
            link: "/dashboard/my-loans"
        });

        revalidatePath('/dashboard/librarian/loans');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}

/**
 * Handles the return of a physical book.
 * Updates the loan record and makes the book available for the next reader.
 */
export async function returnItem(loanId: string) {
    try {
        await dbConnect();
        const loan = await Loan.findById(loanId)
            .populate({ path: 'item', populate: { path: 'work', select: 'title' }})
            .populate('member');

        await Loan.findByIdAndUpdate(loanId, { status: "Returned", returnDate: new Date() });
        await Item.findByIdAndUpdate(loan.item._id, { status: "Available" });

        // Final feedback to the member confirming the book is safely back
        await createNotification({
            recipient: (loan.member as any).user.toString(),
            title: "✅ Livre retourné",
            message: `Le retour de "${(loan.item as any).work.title}" a bien été enregistré. Merci !`,
            type: "loan",
            priority: "low"
        });

        revalidatePath('/dashboard/librarian/loans');
        return { success: true };
    } catch (error: any) {
        return { error: error.message };
    }
}