"use server"

import dbConnect from "@/lib/mongodb";
import { Loan } from "@/lib/models/Loan";
import { Item } from "@/lib/models/Item";
import { Work } from "@/lib/models/Work";
import { Member } from "@/lib/models/Member";
import User from "@/lib/models/User";

/**
 * Aggregates and calculates all key performance indicators (KPIs) and 
 * popularity rankings for the Admin Dashboard.
 * * This function uses Promise.all for speed and MongoDB Aggregation Pipelines 
 * for complex data processing across multiple collections.
 */
export async function getAdminDashboardStats() {
    await dbConnect();

    // 1. Core KPIs
    // Fetching basic counts in parallel to minimize database wait time.
    const [activeLoans, pendingRes, overdueLoans, availableItems, totalMembers, totalStaff] = await Promise.all([
        Loan.countDocuments({ status: "Active" }),
        Loan.countDocuments({ status: "Pending" }),
        Loan.countDocuments({ status: "Overdue" }),
        Item.countDocuments({ status: "Available" }),
        Member.countDocuments(),
        User.countDocuments({ role: { $in: ["admin", "librarian"] } })
    ]);

    // 2. Top Readers
    // Identifying the most active members by counting their entries in the Loan collection.
    const topReaders = await Loan.aggregate([
        { $group: { _id: "$member", loanCount: { $sum: 1 } } },
        { $sort: { loanCount: -1 } },
        { $limit: 5 },
        // Joining with 'members' then 'users' to get the actual human-readable name
        { $lookup: { from: "members", localField: "_id", foreignField: "_id", as: "m" } },
        { $unwind: "$m" },
        { $lookup: { from: "users", localField: "m.user", foreignField: "_id", as: "u" } },
        { $unwind: "$u" },
        { $project: { name: "$u.name", loanCount: 1 } }
    ]);

    // 3. Top Books (Most Borrowed)
    // Ranking 'Works' based on how often their physical 'Items' are loaned out.
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

    // 4. Top Authors
    // Calculated based on the number of works each author has in the catalog.
    // Handles conversion of string IDs to ObjectIDs if necessary.
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

    // 5. Top Categories
    // Groups catalog items by their primary category to show collection distribution.
    const topCategories = await Work.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $lookup: { from: "categories", localField: "_id", foreignField: "_id", as: "details" } },
        { $unwind: { path: "$details", preserveNullAndEmptyArrays: true } },
        { $project: { name: { $ifNull: ["$details.name", "Sans catégorie"] }, count: 1 } }
    ]);

    // 6. Top Genres
    // Since an work can have multiple genres, we unwind the array before grouping.
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

    // 7. Top Publishers
    // Measures the presence of different publishing houses in the library.
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

    // Clean serialization for Next.js Client Components (removes BSON/Date issues)
    return JSON.parse(JSON.stringify(results));
}

/**
 * Fetches real-time statistics for a specific member.
 * This is used to hydrate the MemberView with actual database counts.
 */
export async function getMemberDashboardStats(userId: string) {
    try {
        await dbConnect();

        // First, we need to find the Member document linked to this User ID
        const member = await Member.findOne({ user: userId });
        if (!member) return { loans: 0, dueSoon: 0, overdue: 0, activeLoansList: [] };

        const now = new Date();
        const soon = new Date();
        soon.setDate(now.getDate() + 3); // "Soon" is defined as within 3 days

        // Running counts in parallel for optimal performance
        const [loans, dueSoon, overdue, activeLoansList] = await Promise.all([
            Loan.countDocuments({ member: member._id, status: "Active" }),
            Loan.countDocuments({ 
                member: member._id, 
                status: "Active", 
                dueDate: { $lte: soon, $gte: now } 
            }),
            Loan.countDocuments({ member: member._id, status: "Overdue" }),
            Loan.find({ member: member._id, status: "Active" })
                .populate({
                    path: 'item',
                    populate: { path: 'work', select: 'title' }
                })
                .limit(5)
        ]);

        return JSON.parse(JSON.stringify({ 
            loans, 
            dueSoon, 
            overdue, 
            activeLoansList 
        }));
    } catch (error) {
        console.error("Error fetching member stats:", error);
        return { loans: 0, dueSoon: 0, overdue: 0, activeLoansList: [] };
    }
}

/**
 * Fetches real-time operational data for librarians.
 * Focuses on items requiring immediate attention or daily turnover.
 */
export async function getLibrarianDashboardStats() {
    try {
        await dbConnect();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Parallel execution to keep the dashboard snappy
        const [pendingLoans, returnsToday, newMembersToday] = await Promise.all([
            // Loans waiting for a librarian to hand over the book
            Loan.countDocuments({ status: "Pending" }),
            
            // Loans marked as 'Returned' within the last 24 hours
            Loan.countDocuments({ 
                status: "Returned", 
                updatedAt: { $gte: today } 
            }),
            
            // New library memberships created today
            Member.countDocuments({ 
                createdAt: { $gte: today } 
            })
        ]);

        return {
            pendingLoans,
            returnsToday,
            newMembersToday
        };
    } catch (error) {
        console.error("Librarian Stats Error:", error);
        return { pendingLoans: 0, returnsToday: 0, newMembersToday: 0 };
    }
}