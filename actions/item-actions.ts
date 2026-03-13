'use server';

import { revalidatePath } from 'next/cache';
import { Item } from '@/lib/models/Item';
import '@/lib/models/Work';
import { itemSchema } from '@/lib/validation/item';
import dbConnect from '@/lib/mongodb';

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
        
        const updated = await Item.findByIdAndUpdate(id, validatedData, { new: true });
        revalidatePath('/dashboard/librarian/items');
        return JSON.parse(JSON.stringify(updated));
    } catch (error: any) {
        throw new Error(error.message || "Erreur de mise à jour");
    }
}

export async function deleteItem(id: string) {
    try {
        await dbConnect();
        await Item.findByIdAndDelete(id);
        revalidatePath('/dashboard/librarian/items');
        return { success: true };
    } catch (error) {
        throw new Error("Erreur de suppression");
    }
}