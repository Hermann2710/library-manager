"use server";

import { auth } from "@/auth";
import { Item } from "@/lib/models/Item";
import { Loan } from "@/lib/models/Loan";
import { Member } from "@/lib/models/Member";
import { Work } from "@/lib/models/Work";
import dbConnect from "@/lib/mongodb";
import "@/lib/models/Author";
import "@/lib/models/Item";
import "@/lib/models/Taxonomy";
import "@/lib/models/Work";

export type HomeSuggestion = {
  _id: string;
  title: string;
  description?: string;
  badge?: string;
};

export type SuggestionBlock = {
  label: string;
  title: string;
  description: string;
  suggestions: HomeSuggestion[];
};

const defaultSuggestionBlock: SuggestionBlock = {
  label: "Catalogue public",
  title: "Suggestions selon les livres disponibles.",
  description: "Connectez-vous pour obtenir des suggestions adaptees a votre role et a l'activite de votre structure.",
  suggestions: [],
};

function serializeSuggestions(block: SuggestionBlock) {
  return JSON.parse(JSON.stringify(block)) as SuggestionBlock;
}

async function getRecentCatalogSuggestions(): Promise<SuggestionBlock> {
  const works = await Work.find()
    .select("title description language createdAt")
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  return {
    ...defaultSuggestionBlock,
    suggestions: works.map((work) => ({
      _id: String(work._id),
      title: work.title,
      description: work.description || "Nouvel ouvrage ajoute au catalogue de la structure.",
      badge: work.language,
    })),
  };
}

async function getReaderSuggestions(userId: string): Promise<SuggestionBlock> {
  const member = await Member.findOne({ user: userId }).select("_id").lean();

  if (!member) {
    return {
      label: "Profil lecteur",
      title: "Votre profil membre n'est pas encore initialise.",
      description: "Des suggestions personnalisees apparaitront apres la creation de votre fiche membre et vos premiers emprunts.",
      suggestions: [],
    };
  }

  const loans = await Loan.find({ member: member._id })
    .sort({ updatedAt: -1 })
    .limit(12)
    .populate({
      path: "item",
      select: "work",
      populate: {
        path: "work",
        select: "title description language genres authors",
      },
    })
    .lean();

  const borrowedWorkIds = new Set<string>();
  const genreIds = new Set<string>();
  const authorIds = new Set<string>();
  const languages = new Set<string>();

  loans.forEach((loan) => {
    const work = (loan.item as any)?.work;
    if (!work?._id) return;

    borrowedWorkIds.add(String(work._id));
    work.genres?.forEach((genre: unknown) => genreIds.add(String(genre)));
    work.authors?.forEach((author: unknown) => authorIds.add(String(author)));
    if (work.language) languages.add(work.language);
  });

  if (borrowedWorkIds.size === 0) {
    const recent = await getRecentCatalogSuggestions();

    return {
      label: "Premiers emprunts",
      title: "Commencez avec les derniers ajouts.",
      description: "Apres quelques emprunts, les suggestions tiendront compte des genres et auteurs que vous consultez le plus.",
      suggestions: recent.suggestions,
    };
  }

  const criteria: Record<string, unknown>[] = [];
  if (genreIds.size > 0) criteria.push({ genres: { $in: Array.from(genreIds) } });
  if (authorIds.size > 0) criteria.push({ authors: { $in: Array.from(authorIds) } });
  if (languages.size > 0) criteria.push({ language: { $in: Array.from(languages) } });

  const works = await Work.find({
    _id: { $nin: Array.from(borrowedWorkIds) },
    ...(criteria.length > 0 ? { $or: criteria } : {}),
  })
    .select("title description language")
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  return {
    label: "Connecte comme lecteur",
    title: "Suggestions basees sur vos emprunts.",
    description: "L'assistant utilise vos derniers emprunts pour rapprocher genres, auteurs et langues presents dans le catalogue.",
    suggestions: works.map((work) => ({
      _id: String(work._id),
      title: work.title,
      description: work.description || "Selection proche de vos lectures recentes.",
      badge: work.language,
    })),
  };
}

async function getStaffSuggestions(role: string): Promise<SuggestionBlock> {
  const [pendingLoans, overdueLoans, maintenanceItems, recentWorks] = await Promise.all([
    Loan.countDocuments({ status: "Pending" }),
    Loan.countDocuments({ status: "Overdue" }),
    Item.countDocuments({ status: { $in: ["Lost", "Maintenance"] } }),
    Work.find().select("title description language createdAt").sort({ createdAt: -1 }).limit(1).lean(),
  ]);

  const suggestions: HomeSuggestion[] = [
    {
      _id: "pending-loans",
      title: pendingLoans > 0 ? `${pendingLoans} reservation(s) a valider` : "Aucune reservation en attente",
      description: pendingLoans > 0
        ? "Priorite au comptoir : valider les reservations avant la remise des ouvrages."
        : "Le flux de reservation est calme pour le moment.",
      badge: "Prets",
    },
    {
      _id: "overdue-loans",
      title: overdueLoans > 0 ? `${overdueLoans} pret(s) en retard` : "Aucun retard signale",
      description: overdueLoans > 0
        ? "Relancez les lecteurs concernes et mettez a jour les retours."
        : "Les retours sont sous controle.",
      badge: "Suivi",
    },
    {
      _id: "inventory-alerts",
      title: maintenanceItems > 0 ? `${maintenanceItems} exemplaire(s) a verifier` : "Stock sans alerte critique",
      description: maintenanceItems > 0
        ? "Des exemplaires sont perdus ou en maintenance, une verification physique est recommandee."
        : "Aucune alerte stock majeure n'est remontee.",
      badge: "Stock",
    },
  ];

  if (role === "admin" && recentWorks[0]) {
    suggestions[2] = {
      _id: String(recentWorks[0]._id),
      title: `Dernier ajout : ${recentWorks[0].title}`,
      description: recentWorks[0].description || "Surveillez l'impact des nouveaux ajouts dans les statistiques.",
      badge: recentWorks[0].language || "Catalogue",
    };
  }

  return {
    label: role === "admin" ? "Connecte comme admin" : "Connecte comme bibliothecaire",
    title: "Suggestions selon l'activite de la structure.",
    description: "L'assistant priorise les reservations, retards, alertes de stock et mouvements recents.",
    suggestions,
  };
}

export async function getHomeSuggestions(): Promise<SuggestionBlock> {
  try {
    await dbConnect();
    const session = await auth();
    const role = session?.user?.role;

    if (!session?.user?.id) {
      return serializeSuggestions(await getRecentCatalogSuggestions());
    }

    if (role === "admin" || role === "librarian") {
      return serializeSuggestions(await getStaffSuggestions(role));
    }

    return serializeSuggestions(await getReaderSuggestions(session.user.id));
  } catch {
    return defaultSuggestionBlock;
  }
}
