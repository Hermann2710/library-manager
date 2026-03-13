'use server';

import { revalidatePath } from 'next/cache';
import { Location } from '@/lib/models/Location';
import dbConnect from '@/lib/mongodb';
import { locationSchema } from '@/lib/validation/location';

export async function getLocations() {
    try {
        await dbConnect();
        const locations = await Location.find().sort({ name: 1 });
        return JSON.parse(JSON.stringify(locations));
    } catch (error) {
        throw new Error("Impossible de récupérer les emplacements");
    }
}

export async function createLocation(data: any) {
    try {
        await dbConnect();
        const validatedData = locationSchema.parse(data);
        
        const existing = await Location.findOne({ name: validatedData.name });
        if (existing) throw new Error("Cet emplacement existe déjà");

        const newLocation = await Location.create(validatedData);
        revalidatePath('/dashboard/librarian/inventory'); 
        return JSON.parse(JSON.stringify(newLocation));
    } catch (error: any) {
        throw new Error(error.message || "Erreur de création");
    }
}

export async function updateLocation(id: string, data: any) {
    try {
        await dbConnect();
        const validatedData = locationSchema.parse(data);
        
        const updated = await Location.findByIdAndUpdate(id, validatedData, { new: true });
        revalidatePath('/dashboard/librarian/inventory');
        return JSON.parse(JSON.stringify(updated));
    } catch (error: any) {
        throw new Error(error.message || "Erreur de mise à jour");
    }
}

export async function deleteLocation(id: string) {
    try {
        await dbConnect();
        // Optionnel: vérifier si des Items utilisent cette location avant de supprimer
        await Location.findByIdAndDelete(id);
        revalidatePath('/dashboard/librarian/inventory');
        return { success: true };
    } catch (error) {
        throw new Error("Erreur de suppression");
    }
}