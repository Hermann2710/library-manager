'use server';

import { revalidatePath } from 'next/cache';
import { Category, Genre } from '@/lib/models/Taxonomy';
import { categorySchema, genreSchema } from '@/lib/validation/taxonomy';
import dbConnect from '@/lib/mongodb';

export async function getCategories() {
    await dbConnect();
    const categories = await Category.find().sort({ name: 1 });
    return JSON.parse(JSON.stringify(categories));
}

export async function createCategory(data: any) {
    await dbConnect();
    const validatedData = categorySchema.parse(data);
    const newCategory = await Category.create(validatedData);
    revalidatePath('/dashboard/librarian/taxonomy');
    return JSON.parse(JSON.stringify(newCategory));
}

export async function updateCategory(id: string, data: any) {
    await dbConnect();
    const validatedData = categorySchema.parse(data);
    const updated = await Category.findByIdAndUpdate(id, validatedData, { new: true });
    revalidatePath('/dashboard/librarian/taxonomy');
    return JSON.parse(JSON.stringify(updated));
}

export async function deleteCategory(id: string) {
    await dbConnect();
    await Category.findByIdAndDelete(id);
    revalidatePath('/dashboard/librarian/taxonomy');
}

export async function getGenres() {
    await dbConnect();
    const genres = await Genre.find().sort({ name: 1 });
    return JSON.parse(JSON.stringify(genres));
}

export async function createGenre(data: any) {
    await dbConnect();
    const validatedData = genreSchema.parse(data);
    const newGenre = await Genre.create(validatedData);
    revalidatePath('/dashboard/librarian/taxonomy');
    return JSON.parse(JSON.stringify(newGenre));
}

export async function updateGenre(id: string, data: any) {
    await dbConnect();
    const validatedData = genreSchema.parse(data);
    const updated = await Genre.findByIdAndUpdate(id, validatedData, { new: true });
    revalidatePath('/dashboard/librarian/taxonomy');
    return JSON.parse(JSON.stringify(updated));
}

export async function deleteGenre(id: string) {
    await dbConnect();
    await Genre.findByIdAndDelete(id);
    revalidatePath('/dashboard/librarian/taxonomy');
}