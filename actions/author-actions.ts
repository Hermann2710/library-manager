'use server';

import { revalidatePath } from 'next/cache';
import { Author } from '@/lib/models/Author';
import { authorSchema } from '@/lib/validation/author';
import dbConnect from '@/lib/mongodb';
import { createNotification } from '@/actions/notification-actions';

export async function getAuthors() {
    await dbConnect();
    const authors = await Author.find().sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(authors));
}

export async function createAuthor(data: any) {
    const validatedData = authorSchema.parse(data);
    await dbConnect();
    const newAuthor = await Author.create(validatedData);

    // Notification pour l'équipe administrative
    await createNotification({
        recipientRole: "admin",
        title: "✍️ Nouvel auteur ajouté",
        message: `${newAuthor.firstName} ${newAuthor.lastName} a été ajouté au catalogue.`,
        type: "inventory",
        priority: "low",
        link: "/dashboard/librarian/authors"
    });

    revalidatePath('/dashboard/librarian/authors');
    return JSON.parse(JSON.stringify(newAuthor));
}

export async function updateAuthor(id: string, data: any) {
    const validatedData = authorSchema.parse(data);
    await dbConnect();
    const updated = await Author.findByIdAndUpdate(id, validatedData, { new: true });

    // Notification de modification
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

export async function deleteAuthor(id: string) {
    await dbConnect();
    const authorToDelete = await Author.findById(id);
    
    if (authorToDelete) {
        await createNotification({
            recipientRole: "admin",
            title: "🗑️ Auteur supprimé",
            message: `L'auteur ${authorToDelete.firstName} ${authorToDelete.lastName} a été retiré du système.`,
            type: "inventory",
            priority: "medium" // Priorité plus haute car une suppression est sensible
        });
    }

    await Author.findByIdAndDelete(id);
    revalidatePath('/dashboard/librarian/authors');
}