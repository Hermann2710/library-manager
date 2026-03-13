'use server';

import { revalidatePath } from 'next/cache';
import { Publisher } from '@/lib/models/Publisher';
import { publisherSchema } from '@/lib/validation/publisher';
import dbConnect from '@/lib/mongodb';
import { createNotification } from '@/actions/notification-actions';

export async function getPublishers() {
    await dbConnect();
    const publishers = await Publisher.find().sort({ name: 1 });
    return JSON.parse(JSON.stringify(publishers));
}

export async function createPublisher(data: any) {
    await dbConnect();
    const validatedData = publisherSchema.parse(data);
    const newPublisher = await Publisher.create(validatedData);

    // 🔔 Notification pour l'équipe administrative
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

export async function updatePublisher(id: string, data: any) {
    await dbConnect();
    const validatedData = publisherSchema.parse(data);
    const updated = await Publisher.findByIdAndUpdate(id, validatedData, { new: true });

    // 🔔 Notification de modification
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

export async function deletePublisher(id: string) {
    await dbConnect();
    const publisherToDelete = await Publisher.findById(id);
    
    if (publisherToDelete) {
        // 🔔 Notification de suppression
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