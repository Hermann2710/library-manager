'use server';

import { revalidatePath } from 'next/cache';
import { Author } from '@/lib/models/Author';
import { authorSchema } from '@/lib/validation/author';
import dbConnect from '@/lib/mongodb';

export async function getAuthors() {
    await dbConnect();
    const authors = await Author.find().sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(authors));
}

export async function createAuthor(data: any) {
    const validatedData = authorSchema.parse(data);
    await dbConnect();
    const newAuthor = await Author.create(validatedData);
    revalidatePath('/dashboard/librarian/authors');
    return JSON.parse(JSON.stringify(newAuthor));
}

export async function updateAuthor(id: string, data: any) {
    const validatedData = authorSchema.parse(data);
    await dbConnect();
    const updated = await Author.findByIdAndUpdate(id, validatedData, { new: true });
    revalidatePath('/dashboard/librarian/authors');
    return JSON.parse(JSON.stringify(updated));
}

export async function deleteAuthor(id: string) {
    await dbConnect();
    await Author.findByIdAndDelete(id);
    revalidatePath('/dashboard/librarian/authors');
}