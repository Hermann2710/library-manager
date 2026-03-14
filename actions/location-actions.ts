'use server';

import { revalidatePath } from 'next/cache';
import { Location } from '@/lib/models/Location';
import dbConnect from '@/lib/mongodb';
import { locationSchema } from '@/lib/validation/location';
import { createNotification } from '@/actions/notification-actions';

/**
 * Retrieves all library locations (shelves, rooms, sections).
 * Sorted alphabetically by name to make selection easier in forms.
 */
export async function getLocations() {
    try {
        await dbConnect();
        const locations = await Location.find().sort({ name: 1 });
        return JSON.parse(JSON.stringify(locations));
    } catch (error) {
        throw new Error("Impossible de récupérer les emplacements");
    }
}

/**
 * Creates a new physical storage zone or shelf in the system.
 * Prevents duplicates to maintain a clean and reliable inventory map.
 */
export async function createLocation(data: any) {
    try {
        await dbConnect();
        // Validate input data (name, description, etc.) via Zod
        const validatedData = locationSchema.parse(data);
        
        // Ensure we don't have two locations with the exact same name
        const existing = await Location.findOne({ name: validatedData.name });
        if (existing) throw new Error("Cet emplacement existe déjà");

        const newLocation = await Location.create(validatedData);

        // Notify admins so they are aware of changes in the library layout
        await createNotification({
            recipientRole: "admin",
            title: "📍 Nouvel emplacement",
            message: `L'emplacement "${newLocation.name}" a été ajouté à la configuration.`,
            type: "inventory",
            priority: "low"
        });

        // Trigger a refresh on the inventory dashboard to show the new location
        revalidatePath('/dashboard/librarian/inventory'); 
        return JSON.parse(JSON.stringify(newLocation));
    } catch (error: any) {
        throw new Error(error.message || "Erreur de création");
    }
}

/**
 * Updates a location's details.
 * Useful for renaming shelves or updating storage capacity descriptions.
 */
export async function updateLocation(id: string, data: any) {
    try {
        await dbConnect();
        const validatedData = locationSchema.parse(data);
        
        const updated = await Location.findByIdAndUpdate(id, validatedData, { new: true });

        // Alert administrators about the update to track configuration changes
        await createNotification({
            recipientRole: "admin",
            title: "🔄 Emplacement modifié",
            message: `L'emplacement "${updated.name}" a été mis à jour.`,
            type: "inventory",
            priority: "low"
        });

        revalidatePath('/dashboard/librarian/inventory');
        return JSON.parse(JSON.stringify(updated));
    } catch (error: any) {
        throw new Error(error.message || "Erreur de mise à jour");
    }
}

/**
 * Removes a location from the library's physical map.
 * This should be used with caution as it might affect items currently assigned to it.
 */
export async function deleteLocation(id: string) {
    try {
        await dbConnect();
        const locationToDelete = await Location.findById(id);

        if (locationToDelete) {
            // Log the deletion in the notification system before the record is gone
            await createNotification({
                recipientRole: "admin",
                title: "🗑️ Emplacement supprimé",
                message: `L'emplacement "${locationToDelete.name}" a été retiré du système.`,
                type: "inventory",
                priority: "medium"
            });
        }

        await Location.findByIdAndDelete(id);
        revalidatePath('/dashboard/librarian/inventory');
        return { success: true };
    } catch (error) {
        throw new Error("Erreur de suppression");
    }
}