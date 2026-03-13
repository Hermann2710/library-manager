'use server';

import { revalidatePath } from 'next/cache';
import { Item } from '@/lib/models/Item';
import { Work } from '@/lib/models/Work'; // Import nécessaire pour récupérer le titre
import '@/lib/models/Work';
import { itemSchema } from '@/lib/validation/item';
import dbConnect from '@/lib/mongodb';
import { createNotification } from '@/actions/notification-actions';

export async function getItems() {
    try {
        await dbConnect();
        const items = await Item.find()
            .populate({
                path: 'work',
                select: 'title authors coverImage',
                populate: {
                    path: 'authors',
                    select: 'firstName lastName' 
                }
            })
            .populate('location', 'name')
            .sort({ createdAt: -1 });
        return JSON.parse(JSON.stringify(items));
    } catch (error) {
        throw new Error("Erreur lors de la récupération des exemplaires");
    }
}

export async function createItem(data: any) {
    try {
        await dbConnect();
        const validatedData = itemSchema.parse(data);
        
        const existing = await Item.findOne({ barcode: validatedData.barcode });
        if (existing) throw new Error("Ce code-barres est déjà utilisé");

        const newItem = await Item.create(validatedData);
        
        // Notification : Nouvel exemplaire en rayon
        const work = await Work.findById(newItem.work);
        await createNotification({
            recipientRole: "librarian",
            title: "📦 Nouvel exemplaire",
            message: `Un nouvel exemplaire de "${work?.title || 'Ouvrage'}" (Code: ${newItem.barcode}) a été ajouté.`,
            type: "inventory",
            priority: "low",
            link: "/dashboard/librarian/items"
        });

        revalidatePath('/dashboard/librarian/items');
        return JSON.parse(JSON.stringify(newItem));
    } catch (error: any) {
        throw new Error(error.message || "Erreur de création");
    }
}

export async function updateItem(id: string, data: any) {
    try {
        await dbConnect();
        const validatedData = itemSchema.parse(data);
        
        // On récupère l'ancien état pour comparer
        const oldItem = await Item.findById(id);
        const updated = await Item.findByIdAndUpdate(id, validatedData, { new: true });

        // Notification si l'état change vers "Lost" ou "Maintenance"
        if (oldItem.status !== updated.status && (updated.status === "Lost" || updated.status === "Maintenance")) {
            const work = await Work.findById(updated.work);
            await createNotification({
                recipientRole: "admin",
                title: updated.status === "Lost" ? "⚠️ Exemplaire perdu" : "🔧 Mise en maintenance",
                message: `L'exemplaire ${updated.barcode} ("${work?.title}") est désormais marqué comme ${updated.status}.`,
                type: "inventory",
                priority: updated.status === "Lost" ? "high" : "medium",
                link: "/dashboard/librarian/items"
            });
        }

        revalidatePath('/dashboard/librarian/items');
        return JSON.parse(JSON.stringify(updated));
    } catch (error: any) {
        throw new Error(error.message || "Erreur de mise à jour");
    }
}

export async function deleteItem(id: string) {
    try {
        await dbConnect();
        const itemToDelete = await Item.findById(id).populate('work', 'title');
        
        if (itemToDelete) {
            await createNotification({
                recipientRole: "admin",
                title: "🗑️ Exemplaire retiré",
                message: `L'exemplaire ${itemToDelete.barcode} (${(itemToDelete.work as any).title}) a été définitivement supprimé.`,
                type: "inventory",
                priority: "medium"
            });
        }

        await Item.findByIdAndDelete(id);
        revalidatePath('/dashboard/librarian/items');
        return { success: true };
    } catch (error) {
        throw new Error("Erreur de suppression");
    }
}