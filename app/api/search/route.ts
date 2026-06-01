import { auth } from "@/auth";
import { isRole } from "@/lib/access-control";
import dbConnect from "@/lib/mongodb";
import { Author } from "@/lib/models/Author";
import { Item } from "@/lib/models/Item";
import { Loan } from "@/lib/models/Loan";
import { Location } from "@/lib/models/Location";
import { Member } from "@/lib/models/Member";
import { Publisher } from "@/lib/models/Publisher";
import { Category, Genre } from "@/lib/models/Taxonomy";
import User from "@/lib/models/User";
import { Work } from "@/lib/models/Work";
import { NextResponse } from "next/server";

type SearchResult = {
  id: string;
  title: string;
  type: string;
  url: string;
};

function asId(value: unknown) {
  return String(value);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim();
  const session = await auth();

  if (!query || query.length < 2 || !session?.user) {
    return NextResponse.json([]);
  }

  const role = isRole(session.user.role) ? session.user.role : "reader";
  const isStaff = role === "admin" || role === "librarian";
  const regex = { $regex: query, $options: "i" };

  try {
    await dbConnect();

    const [works, authors] = await Promise.all([
      Work.find({ $or: [{ title: regex }, { isbn: regex }] })
        .select("title")
        .limit(5)
        .lean(),
      Author.find({ $or: [{ firstName: regex }, { lastName: regex }] })
        .select("firstName lastName")
        .limit(isStaff ? 5 : 3)
        .lean(),
    ]);

    const results: SearchResult[] = [
      ...works.map((work) => ({
        id: asId(work._id),
        title: work.title,
        type: "Ouvrage",
        url: `/dashboard/search?q=${encodeURIComponent(work.title)}`,
      })),
      ...authors.map((author) => {
        const name = `${author.firstName} ${author.lastName}`;

        return {
          id: asId(author._id),
          title: name,
          type: "Auteur",
          url: isStaff
            ? "/dashboard/librarian/authors"
            : `/dashboard/search?q=${encodeURIComponent(name)}`,
        };
      }),
    ];

    if (role === "reader") {
      const member = await Member.findOne({ user: session.user.id }).select("_id").lean();

      if (member) {
        const loans = await Loan.find({ member: member._id })
          .sort({ updatedAt: -1 })
          .limit(5)
          .populate({
            path: "item",
            select: "work barcode",
            populate: {
              path: "work",
              select: "title",
            },
          })
          .lean();

        results.push(
          ...loans
            .filter((loan) => {
              const workTitle = (loan.item as any)?.work?.title || "";
              return workTitle.toLowerCase().includes(query.toLowerCase());
            })
            .map((loan) => ({
              id: asId(loan._id),
              title: (loan.item as any)?.work?.title || "Pret en cours",
              type: "Mes emprunts",
              url: "/dashboard/my-loans",
            }))
        );
      }
    }

    if (isStaff) {
      const [members, items, publishers, categories, genres, locations, users] = await Promise.all([
        Member.find()
          .populate({ path: "user", match: { $or: [{ name: regex }, { email: regex }] }, select: "name email" })
          .limit(5)
          .lean(),
        Item.find({ barcode: regex }).select("barcode status").limit(5).lean(),
        Publisher.find({ name: regex }).select("name").limit(5).lean(),
        Category.find({ name: regex }).select("name").limit(5).lean(),
        Genre.find({ name: regex }).select("name").limit(5).lean(),
        Location.find({ name: regex }).select("name").limit(5).lean(),
        role === "admin"
          ? User.find({ $or: [{ name: regex }, { email: regex }] }).select("name email").limit(5).lean()
          : Promise.resolve([]),
      ]);

      results.push(
        ...members
          .filter((member) => member.user)
          .map((member) => ({
            id: asId(member._id),
            title: (member.user as any).name,
            type: "Membre",
            url: "/dashboard/librarian/members",
          })),
        ...items.map((item) => ({
          id: asId(item._id),
          title: `Exemplaire ${item.barcode}`,
          type: "Exemplaire",
          url: "/dashboard/librarian/items",
        })),
        ...publishers.map((publisher) => ({
          id: asId(publisher._id),
          title: publisher.name,
          type: "Editeur",
          url: "/dashboard/librarian/publishers",
        })),
        ...categories.map((category) => ({
          id: asId(category._id),
          title: category.name,
          type: "Categorie",
          url: "/dashboard/librarian/taxonomy",
        })),
        ...genres.map((genre) => ({
          id: asId(genre._id),
          title: genre.name,
          type: "Genre",
          url: "/dashboard/librarian/taxonomy",
        })),
        ...locations.map((location) => ({
          id: asId(location._id),
          title: location.name,
          type: "Emplacement",
          url: "/dashboard/librarian/locations",
        }))
      );

      if (role === "admin") {
        results.push(
          ...users.map((user) => ({
            id: asId(user._id),
            title: `${user.name} (${user.email})`,
            type: "Utilisateur",
            url: "/dashboard/admin/users",
          }))
        );
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
