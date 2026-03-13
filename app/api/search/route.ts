import { NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import { Work } from "@/lib/models/Work";
import { Author } from "@/lib/models/Author";
import { Member } from "@/lib/models/Member";
import { Loan } from "@/lib/models/Loan";
import { Item } from "@/lib/models/Item";
import { Publisher } from "@/lib/models/Publisher";
import { Category, Genre } from "@/lib/models/Taxonomy";
import { Location } from "@/lib/models/Location";
import User from "@/lib/models/User";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const session = await auth();

    if (!query || query.length < 2 || !session) return NextResponse.json([]);

    const role = (session.user as any).role;
    const isStaff = role === "admin" || role === "librarian";

    try {
        await dbConnect();
        const regex = { $regex: query, $options: "i" };
        const results: any[] = [];

        // --- 1. RECHERCHE PUBLIQUE (Accessible à tous) ---
        const [works, authors] = await Promise.all([
            Work.find({ $or: [{ title: regex }, { isbn: regex }] }).limit(3).select("title"),
            Author.find({ $or: [{ firstName: regex }, { lastName: regex }] }).limit(3),
        ]);

        results.push(...works.map(w => ({ id: w._id, title: w.title, type: "Ouvrage", url: `/dashboard/search/${w._id}` })));
        results.push(...authors.map(a => ({ id: a._id, title: `${a.firstName} ${a.lastName}`, type: "Auteur", url: `/dashboard/librarian/authors` })));

        // --- 2. RECHERCHE PRIVÉE (Mes Emprunts) ---
        if (role === "reader") {
            const myMember = await Member.findOne({ user: session.user.id });
            if (myMember) {
                const myLoans = await Loan.find({ member: myMember._id }).populate("item").limit(2);
                // On peut filtrer côté code pour la démo ou via mongo
                results.push(...myLoans.map(l => ({ id: l._id, title: `Mon prêt: ${l.loanId}`, type: "Mes Emprunts", url: `/dashboard/my-loans` })));
            }
        }

        // --- 3. RECHERCHE STAFF (Admin / Librarian uniquement) ---
        if (isStaff) {
            const staffTasks = await Promise.all([
                Member.find().populate({ path: 'user', match: { name: regex }, select: 'name' }).limit(3),
                Item.find({ serialNumber: regex }).limit(3),
                Publisher.find({ name: regex }).limit(3),
                Category.find({ name: regex }).limit(3),
                Genre.find({ name: regex }).limit(3),
                Location.find({ $or: [{ room: regex }, { shelf: regex }] }).limit(3),
                role === "admin" ? User.find({ $or: [{ name: regex }, { email: regex }] }).limit(3) : []
            ]);

            const [members, items, publishers, categories, genres, locations, users] = staffTasks;

            results.push(...members.filter(m => m.user).map(m => ({ id: m._id, title: (m.user as any).name, type: "Membre", url: `/dashboard/librarian/members` })));
            results.push(...items.map(i => ({ id: i._id, title: `Exemplaire: ${i.serialNumber}`, type: "Exemplaire", url: `/dashboard/librarian/items` })));
            results.push(...publishers.map(p => ({ id: p._id, title: p.name, type: "Éditeur", url: `/dashboard/librarian/publishers` })));
            results.push(...categories.map(c => ({ id: c._id, title: c.name, type: "Taxonomie (Cat)", url: `/dashboard/librarian/taxonomy` })));
            results.push(...genres.map(g => ({ id: g._id, title: g.name, type: "Taxonomie (Genre)", url: `/dashboard/librarian/taxonomy` })));
            results.push(...locations.map(l => ({ id: l._id, title: `${l.room} - ${l.shelf}`, type: "Emplacement", url: `/dashboard/librarian/locations` })));
            if (role === "admin") {
                results.push(...users.map((u: any) => ({ id: u._id, title: u.name, type: "Utilisateur", url: `/dashboard/admin/users` })));
            }
        }

        return NextResponse.json(results);
    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}