import { LayoutDashboard, BookOpen, Users, History, ShieldCheck } from "lucide-react";

export const DASHBOARD_CONFIG = {
  admin: [
    { title: "Statistiques", url: "/dashboard/admin", icon: LayoutDashboard },
    { title: "Utilisateurs", url: "/dashboard/admin/users", icon: Users },
  ],
  librarian: [
    { title: "Catalogue", url: "/dashboard/librarian/books", icon: BookOpen },
    { title: "Prêts en cours", url: "/dashboard/librarian/loans", icon: ShieldCheck },
  ],
  reader: [
    { title: "Mes Livres", url: "/dashboard/reader", icon: BookOpen },
    { title: "Historique", url: "/dashboard/reader/history", icon: History },
  ],
};