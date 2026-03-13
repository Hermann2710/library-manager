'use server';

import { revalidatePath } from 'next/cache';
import { Work } from '@/lib/models/Work';
// On importe les autres modèles pour que le .populate() fonctionne
import '@/lib/models/Author';
import '@/lib/models/Publisher';
import '@/lib/models/Taxonomy'; 
import { workSchema } from '@/lib/validation/work';
import dbConnect from '@/lib/mongodb';

/**
 * Récupère toutes les œuvres avec leurs relations développées
 */
export async function getWorks() {
    try {
        await dbConnect();
        const works = await Work.find()
            .populate('publisher', 'name')
            .populate('category', 'name')
            .populate('authors', 'firstName lastName')
            .populate('genres', 'name')
            .sort({ createdAt: -1 });
            
        return JSON.parse(JSON.stringify(works));
    } catch (error) {
        console.error("Erreur getWorks:", error);
        throw new Error("Impossible de récupérer le catalogue");
    }
}

/**
 * Récupère une œuvre spécifique par son ID (utile pour la page détails)
 */
export async function getWorkById(id: string) {
    await dbConnect();
    const work = await Work.findById(id)
        .populate('publisher')
        .populate('category')
        .populate('authors')
        .populate('genres');
    return JSON.parse(JSON.stringify(work));
}

/**
 * Création d'une œuvre
 */
export async function createWork(data: any) {
    try {
        await dbConnect();
        const validatedData = workSchema.parse(data);
        
        // Vérification optionnelle : ISBN unique
        if (validatedData.isbn) {
            const existing = await Work.findOne({ isbn: validatedData.isbn });
            if (existing) throw new Error("Cet ISBN existe déjà dans le catalogue");
        }

        const newWork = await Work.create(validatedData);
        revalidatePath('/dashboard/librarian/works');
        return JSON.parse(JSON.stringify(newWork));
    } catch (error: any) {
        throw new Error(error.message || "Erreur lors de la création de l'œuvre");
    }
}

/**
 * Mise à jour d'une œuvre
 */
export async function updateWork(id: string, data: any) {
    try {
        await dbConnect();
        const validatedData = workSchema.parse(data);
        
        const updatedWork = await Work.findByIdAndUpdate(
            id, 
            validatedData, 
            { new: true, runValidators: true }
        );
        
        if (!updatedWork) throw new Error("Œuvre non trouvée");
        
        revalidatePath('/dashboard/librarian/works');
        return JSON.parse(JSON.stringify(updatedWork));
    } catch (error: any) {
        throw new Error(error.message || "Erreur lors de la mise à jour");
    }
}

/**
 * Suppression d'une œuvre
 */
export async function deleteWork(id: string) {
    try {
        await dbConnect();
        // Plus tard, il faudra vérifier si des "Items" (exemplaires) sont liés 
        // avant de supprimer l'œuvre parente.
        await Work.findByIdAndDelete(id);
        revalidatePath('/dashboard/librarian/works');
        return { success: true };
    } catch (error) {
        throw new Error("Erreur lors de la suppression");
    }
}