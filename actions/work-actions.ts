'use server';

import { revalidatePath } from 'next/cache';
import { Work } from '@/lib/models/Work';
// On importe les autres modèles pour que le .populate() fonctionne
import '@/lib/models/Author';
import '@/lib/models/Publisher';
import '@/lib/models/Taxonomy'; 
import { workSchema } from '@/lib/validation/work';
import dbConnect from '@/lib/mongodb';
import { createNotification } from '@/actions/notification-actions';

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
 * Récupère une œuvre spécifique par son ID
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
        
        const { language, ...rest } = data;
        const cleanData = { ...rest, language: String(language).trim() };

        const validatedData = workSchema.parse(cleanData);
        
        if (validatedData.isbn) {
            const existing = await Work.findOne({ isbn: validatedData.isbn });
            if (existing) throw new Error("ISBN déjà utilisé");
        }

        const newWork = await Work.create(validatedData);

        // 🔔 Notification pour TOUS les Lecteurs (Nouveauté catalogue)
        await createNotification({
            recipientRole: "reader",
            title: "📚 Nouveau livre disponible !",
            message: `"${newWork.title}" vient d'être ajouté au catalogue. Venez le découvrir !`,
            type: "inventory",
            priority: "low",
            link: `/dashboard/search` // Redirige vers la recherche/catalogue
        });

        // 🔔 Notification pour les Admins (Audit)
        await createNotification({
            recipientRole: "admin",
            title: "🆕 Œuvre créée",
            message: `Une nouvelle fiche œuvre a été créée : "${newWork.title}".`,
            type: "inventory",
            priority: "low",
            link: "/dashboard/librarian/works"
        });

        revalidatePath('/dashboard/librarian/works');
        return JSON.parse(JSON.stringify(newWork));
    } catch (error: any) {
        throw new Error(error.message);
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

        // 🔔 Notification pour les Admins
        await createNotification({
            recipientRole: "admin",
            title: "🔄 Fiche œuvre modifiée",
            message: `Le titre ou les informations de "${updatedWork.title}" ont été mis à jour.`,
            type: "inventory",
            priority: "low"
        });
        
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
        const workToDelete = await Work.findById(id);

        if (workToDelete) {
            // 🔔 Notification pour les Admins (Action importante)
            await createNotification({
                recipientRole: "admin",
                title: "🗑️ Œuvre supprimée",
                message: `L'œuvre "${workToDelete.title}" a été définitivement retirée du catalogue.`,
                type: "inventory",
                priority: "medium"
            });
        }

        await Work.findByIdAndDelete(id);
        revalidatePath('/dashboard/librarian/works');
        return { success: true };
    } catch (error) {
        throw new Error("Erreur lors de la suppression");
    }
}