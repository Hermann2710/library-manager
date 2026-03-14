'use server';

import { revalidatePath } from 'next/cache';
import { Publisher } from '@/lib/models/Publisher';
import { publisherSchema } from '@/lib/validation/publisher';
import dbConnect from '@/lib/mongodb';
import { createNotification } from '@/actions/notification-actions';

/**
 * Retrieves the full list of publishing houses.
 * Sorted alphabetically by name to keep the management list organized.
 */
export async function getPublishers() {
    await dbConnect();
    const publishers = await Publisher.find().sort({ name: 1 });
    return JSON.parse(JSON.stringify(publishers));
}

/**
 * Adds a new publisher to the system.
 * Useful for expanding the library's network and catalog diversity.
 */
export async function createPublisher(data: any) {
    await dbConnect();
    // Validate name, contact info, or website via the Zod schema
    const validatedData = publisherSchema.parse(data);
    const newPublisher = await Publisher.create(validatedData);

    // Alert admins that a new partner/entity is now available in the inventory system
    await createNotification({
        recipientRole: "admin",
        title: "🏢 Nouvel éditeur",
        message: `L'éditeur "${newPublisher.name}" a été ajouté au catalogue.`,
        type: "inventory",
        priority: "low",
        link: "/dashboard/librarian/publishers"
    });

    revalidatePath('/dashboard/librarian/publishers');
    return JSON.parse(JSON.stringify(newPublisher));
}

/**
 * Updates a publisher's details.
 * Essential for keeping contact information or branding up to date.
 */
export async function updatePublisher(id: string, data: any) {
    await dbConnect();
    const validatedData = publisherSchema.parse(data);
    const updated = await Publisher.findByIdAndUpdate(id, validatedData, { new: true });

    // Notify the team about the change to maintain data transparency
    await createNotification({
        recipientRole: "admin",
        title: "🔄 Éditeur mis à jour",
        message: `Les informations de l'éditeur "${updated.name}" ont été modifiées.`,
        type: "inventory",
        priority: "low"
    });

    revalidatePath('/dashboard/librarian/publishers');
    return JSON.parse(JSON.stringify(updated));
}

/**
 * Removes a publisher from the database.
 * Sends a notification before deletion to capture the name for the logs.
 */
export async function deletePublisher(id: string) {
    await dbConnect();
    const publisherToDelete = await Publisher.findById(id);
    
    if (publisherToDelete) {
        // Highlighting this as a medium priority since it might affect book references
        await createNotification({
            recipientRole: "admin",
            title: "🗑️ Éditeur supprimé",
            message: `L'éditeur "${publisherToDelete.name}" a été retiré du catalogue.`,
            type: "inventory",
            priority: "medium"
        });
    }

    await Publisher.findByIdAndDelete(id);
    revalidatePath('/dashboard/librarian/publishers');
}