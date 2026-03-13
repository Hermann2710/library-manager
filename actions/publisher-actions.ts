'use server';

import { revalidatePath } from 'next/cache';
import { Publisher } from '@/lib/models/Publisher';
import { publisherSchema } from '@/lib/validation/publisher';
import dbConnect from '@/lib/mongodb';

export async function getPublishers() {
    await dbConnect();
    const publishers = await Publisher.find().sort({ name: 1 });
    return JSON.parse(JSON.stringify(publishers));
}

export async function createPublisher(data: any) {
    await dbConnect();
    const validatedData = publisherSchema.parse(data);
    const newPublisher = await Publisher.create(validatedData);
    revalidatePath('/dashboard/librarian/publishers');
    return JSON.parse(JSON.stringify(newPublisher));
}

export async function updatePublisher(id: string, data: any) {
    await dbConnect();
    const validatedData = publisherSchema.parse(data);
    const updated = await Publisher.findByIdAndUpdate(id, validatedData, { new: true });
    revalidatePath('/dashboard/librarian/publishers');
    return JSON.parse(JSON.stringify(updated));
}

export async function deletePublisher(id: string) {
    await dbConnect();
    await Publisher.findByIdAndDelete(id);
    revalidatePath('/dashboard/librarian/publishers');
}