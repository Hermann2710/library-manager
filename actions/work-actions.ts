'use server';

import { revalidatePath } from 'next/cache';
import { Work } from '@/lib/models/Work';
// Important: We import these models to ensure Mongoose can resolve 
// the references during the .populate() calls.
import '@/lib/models/Author';
import '@/lib/models/Publisher';
import '@/lib/models/Taxonomy'; 
import { workSchema } from '@/lib/validation/work';
import dbConnect from '@/lib/mongodb';
import { createNotification } from '@/actions/notification-actions';

/**
 * Retrieves the entire library catalog with all relational data expanded.
 * It transforms IDs into readable names for the UI (Publisher, Category, Authors, etc.).
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
            
        // Standardizing the output for Next.js Client Components
        return JSON.parse(JSON.stringify(works));
    } catch (error) {
        console.error("Erreur getWorks:", error);
        throw new Error("Impossible de récupérer le catalogue");
    }
}

/**
 * Fetches the full details of a single book by its ID.
 * Perfect for the book details page or the catalog management forms.
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
 * Creates a new literary work record.
 * Handles language string sanitization, ISBN uniqueness checks, 
 * and broadcasts the news to all readers.
 */
export async function createWork(data: any) {
    try {
        await dbConnect();
        
        // Data cleaning: Ensure the language string is trimmed and valid
        const { language, ...rest } = data;
        const cleanData = { ...rest, language: String(language).trim() };

        const validatedData = workSchema.parse(cleanData);
        
        // ISBN Check: Prevents duplicate catalog entries
        if (validatedData.isbn) {
            const existing = await Work.findOne({ isbn: validatedData.isbn });
            if (existing) throw new Error("ISBN déjà utilisé");
        }

        const newWork = await Work.create(validatedData);

        // 🔔 Broadcaster: Notify ALL Readers about the new addition!
        // This boosts user engagement by highlighting new content.
        await createNotification({
            recipientRole: "reader",
            title: "📚 Nouveau livre disponible !",
            message: `"${newWork.title}" vient d'être ajouté au catalogue. Venez le découvrir !`,
            type: "inventory",
            priority: "low",
            link: `/dashboard/search` 
        });

        // 🔔 Admin Audit: Log the creation for the staff team
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
 * Updates an existing work's metadata.
 * Triggers revalidation to ensure the catalog reflects the latest changes.
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

        // Simple update log for administrators
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
 * Permanently deletes a work and its metadata from the system.
 */
export async function deleteWork(id: string) {
    try {
        await dbConnect();
        const workToDelete = await Work.findById(id);

        if (workToDelete) {
            // Medium priority alert since deleting a 'Work' is a major catalog change
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