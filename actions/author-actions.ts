'use server';

import { revalidatePath } from 'next/cache';
import { Author } from '@/lib/models/Author';
import { authorSchema } from '@/lib/validation/author';
import dbConnect from '@/lib/mongodb';
import { createNotification } from '@/actions/notification-actions';

/**
 * Fetches the full list of authors from the database.
 * Results are sorted by creation date (newest first) to keep the catalog fresh.
 */
export async function getAuthors() {
    await dbConnect();
    const authors = await Author.find().sort({ createdAt: -1 });
    // Stringify/Parse trick to avoid Next.js issues with MongoDB BSON types
    return JSON.parse(JSON.stringify(authors));
}

/**
 * Adds a new author to the library's database.
 * Validates the input before creation and alerts the admin team.
 */
export async function createAuthor(data: any) {
    // Ensuring the data matches our author schema (bio, names, etc.)
    const validatedData = authorSchema.parse(data);
    await dbConnect();
    
    const newAuthor = await Author.create(validatedData);

    // Alert the admin team so they can review the new entry in the inventory
    await createNotification({
        recipientRole: "admin",
        title: "✍️ Nouvel auteur ajouté",
        message: `${newAuthor.firstName} ${newAuthor.lastName} a été ajouté au catalogue.`,
        type: "inventory",
        priority: "low",
        link: "/dashboard/librarian/authors"
    });

    // Refresh the UI to reflect the new addition immediately
    revalidatePath('/dashboard/librarian/authors');
    return JSON.parse(JSON.stringify(newAuthor));
}

/**
 * Updates an existing author's profile.
 * Perfect for fixing typos or updating an author's biography.
 */
export async function updateAuthor(id: string, data: any) {
    const validatedData = authorSchema.parse(data);
    await dbConnect();
    
    const updated = await Author.findByIdAndUpdate(id, validatedData, { new: true });

    // Keeping track of inventory changes is key for catalog consistency
    await createNotification({
        recipientRole: "admin",
        title: "🔄 Fiche auteur mise à jour",
        message: `Les informations de ${updated.firstName} ${updated.lastName} ont été modifiées.`,
        type: "inventory",
        priority: "low"
    });

    revalidatePath('/dashboard/librarian/authors');
    return JSON.parse(JSON.stringify(updated));
}

/**
 * Removes an author from the system.
 * Sends a medium-priority alert because deleting data is a sensitive operation.
 */
export async function deleteAuthor(id: string) {
    await dbConnect();
    const authorToDelete = await Author.findById(id);
    
    if (authorToDelete) {
        // Notification sent before deletion to ensure we have the record's name for the message
        await createNotification({
            recipientRole: "admin",
            title: "🗑️ Auteur supprimé",
            message: `L'auteur ${authorToDelete.firstName} ${authorToDelete.lastName} a été retiré du système.`,
            type: "inventory",
            priority: "medium" 
        });
    }

    await Author.findByIdAndDelete(id);
    // Ensure the list is updated so librarians don't see deleted records
    revalidatePath('/dashboard/librarian/authors');
}