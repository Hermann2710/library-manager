'use server';

import { revalidatePath } from 'next/cache';
import { Category, Genre } from '@/lib/models/Taxonomy';
import { categorySchema, genreSchema } from '@/lib/validation/taxonomy';
import dbConnect from '@/lib/mongodb';
import { createNotification } from '@/actions/notification-actions';

// --- CATÉGORIES ---

export async function getCategories() {
    await dbConnect();
    const categories = await Category.find().sort({ name: 1 });
    return JSON.parse(JSON.stringify(categories));
}

export async function createCategory(data: any) {
    await dbConnect();
    const validatedData = categorySchema.parse(data);
    const newCategory = await Category.create(validatedData);

    await createNotification({
        recipientRole: "admin",
        title: "📁 Nouvelle catégorie",
        message: `La catégorie "${newCategory.name}" a été ajoutée.`,
        type: "inventory",
        priority: "low",
        link: "/dashboard/librarian/taxonomy"
    });

    revalidatePath('/dashboard/librarian/taxonomy');
    return JSON.parse(JSON.stringify(newCategory));
}

export async function updateCategory(id: string, data: any) {
    await dbConnect();
    const validatedData = categorySchema.parse(data);
    const updated = await Category.findByIdAndUpdate(id, validatedData, { new: true });

    await createNotification({
        recipientRole: "admin",
        title: "🔄 Catégorie mise à jour",
        message: `La catégorie "${updated.name}" a été modifiée.`,
        type: "inventory",
        priority: "low"
    });

    revalidatePath('/dashboard/librarian/taxonomy');
    return JSON.parse(JSON.stringify(updated));
}

export async function deleteCategory(id: string) {
    await dbConnect();
    const category = await Category.findById(id);
    if (category) {
        await createNotification({
            recipientRole: "admin",
            title: "🗑️ Catégorie supprimée",
            message: `La catégorie "${category.name}" a été retirée du système.`,
            type: "inventory",
            priority: "medium"
        });
    }
    await Category.findByIdAndDelete(id);
    revalidatePath('/dashboard/librarian/taxonomy');
}

// --- GENRES ---

export async function getGenres() {
    await dbConnect();
    const genres = await Genre.find().sort({ name: 1 });
    return JSON.parse(JSON.stringify(genres));
}

export async function createGenre(data: any) {
    await dbConnect();
    const validatedData = genreSchema.parse(data);
    const newGenre = await Genre.create(validatedData);

    await createNotification({
        recipientRole: "admin",
        title: "🎭 Nouveau genre",
        message: `Le genre littéraire "${newGenre.name}" a été ajouté.`,
        type: "inventory",
        priority: "low",
        link: "/dashboard/librarian/taxonomy"
    });

    revalidatePath('/dashboard/librarian/taxonomy');
    return JSON.parse(JSON.stringify(newGenre));
}

export async function updateGenre(id: string, data: any) {
    await dbConnect();
    const validatedData = genreSchema.parse(data);
    const updated = await Genre.findByIdAndUpdate(id, validatedData, { new: true });

    await createNotification({
        recipientRole: "admin",
        title: "🔄 Genre mis à jour",
        message: `Le genre "${updated.name}" a été modifié.`,
        type: "inventory",
        priority: "low"
    });

    revalidatePath('/dashboard/librarian/taxonomy');
    return JSON.parse(JSON.stringify(updated));
}

export async function deleteGenre(id: string) {
    await dbConnect();
    const genre = await Genre.findById(id);
    if (genre) {
        await createNotification({
            recipientRole: "admin",
            title: "🗑️ Genre supprimé",
            message: `Le genre "${genre.name}" a été retiré.`,
            type: "inventory",
            priority: "medium"
        });
    }
    await Genre.findByIdAndDelete(id);
    revalidatePath('/dashboard/librarian/taxonomy');
}