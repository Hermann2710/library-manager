"use server"

import dbConnect from "@/lib/mongodb";
import { Loan } from "@/lib/models/Loan";
import { Item } from "@/lib/models/Item";
import { Work } from "@/lib/models/Work";
import { Member } from "@/lib/models/Member";
import User from "@/lib/models/User";

export async function getAdminDashboardStats() {
    await dbConnect();

    // 1. Chiffres clés (KPIs)
    const [activeLoans, pendingRes, overdueLoans, availableItems, totalMembers, totalStaff] = await Promise.all([
        Loan.countDocuments({ status: "Active" }),
        Loan.countDocuments({ status: "Pending" }),
        Loan.countDocuments({ status: "Overdue" }),
        Item.countDocuments({ status: "Available" }),
        Member.countDocuments(),
        User.countDocuments({ role: { $in: ["admin", "librarian"] } })
    ]);

    // 2. Top Lecteurs (Basé sur le nombre de prêts)
    const topReaders = await Loan.aggregate([
        { $group: { _id: "$member", loanCount: { $sum: 1 } } },
        { $sort: { loanCount: -1 } },
        { $limit: 5 },
        { $lookup: { from: "members", localField: "_id", foreignField: "_id", as: "m" } },
        { $unwind: "$m" },
        { $lookup: { from: "users", localField: "m.user", foreignField: "_id", as: "u" } },
        { $unwind: "$u" },
        { $project: { name: "$u.name", loanCount: 1 } }
    ]);

    // 3. Top Livres (Basé sur la popularité des exemplaires empruntés)
    const topBooks = await Loan.aggregate([
        { $group: { _id: "$item", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $lookup: { from: "items", localField: "_id", foreignField: "_id", as: "i" } },
        { $unwind: "$i" },
        { $lookup: { from: "works", localField: "i.work", foreignField: "_id", as: "w" } },
        { $unwind: "$w" },
        { $project: { title: "$w.title", count: 1 } }
    ]);

    // 4. Top Auteurs (Calculé à partir du nombre d'ouvrages par auteur)
    const topAuthors = await Work.aggregate([
        { $unwind: "$authors" },
        { 
            $addFields: { 
                authorId: { 
                    $cond: [
                        { $eq: [{ $type: "$authors" }, "string"] }, 
                        { $toObjectId: "$authors" }, 
                        "$authors"
                    ] 
                } 
            } 
        },
        { $group: { _id: "$authorId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $lookup: { from: "authors", localField: "_id", foreignField: "_id", as: "details" } },
        { $unwind: { path: "$details", preserveNullAndEmptyArrays: true } },
        { 
            $project: { 
                name: { 
                    $cond: {
                        if: { $gt: ["$details", null] },
                        then: { $concat: ["$details.firstName", " ", "$details.lastName"] },
                        else: "Auteur inconnu"
                    }
                }, 
                count: 1 
            } 
        }
    ]);

    // 5. Top Catégories
    const topCategories = await Work.aggregate([
    // On utilise "category" au singulier comme dans ton schéma
    // Pas besoin de $unwind car ce n'est pas un tableau
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    { 
        $lookup: { 
            from: "categories", 
            localField: "_id", 
            foreignField: "_id", 
            as: "details" 
        } 
    },
    { $unwind: { path: "$details", preserveNullAndEmptyArrays: true } },
    { 
        $project: { 
            name: { $ifNull: ["$details.name", "Sans catégorie"] }, 
            count: 1 
        } 
    }
]);

    // 6. Top Genres
    const topGenres = await Work.aggregate([
        { $unwind: "$genres" },
        { 
            $addFields: { 
                genreId: { 
                    $cond: [
                        { $eq: [{ $type: "$genres" }, "string"] }, 
                        { $toObjectId: "$genres" }, 
                        "$genres"
                    ] 
                } 
            } 
        },
        { $group: { _id: "$genreId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $lookup: { from: "genres", localField: "_id", foreignField: "_id", as: "details" } },
        { $unwind: { path: "$details", preserveNullAndEmptyArrays: true } },
        { $project: { name: { $ifNull: ["$details.name", "Sans genre"] }, count: 1 } }
    ]);

    // 7. Top Éditeurs
    const topPublishers = await Work.aggregate([
        { $group: { _id: "$publisher", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $lookup: { from: "publishers", localField: "_id", foreignField: "_id", as: "details" } },
        { $unwind: { path: "$details", preserveNullAndEmptyArrays: true } },
        { $project: { name: { $ifNull: ["$details.name", "Éditeur inconnu"] }, count: 1 } }
    ]);

    const results = {
        counts: { activeLoans, pendingRes, overdueLoans, availableItems, totalMembers, totalStaff },
        topReaders,
        topBooks,
        topAuthors,
        topCategories,
        topGenres,
        topPublishers,
    };

    // Transformation en JSON pur pour éviter les erreurs de sérialisation Client/Server
    return JSON.parse(JSON.stringify(results));
}