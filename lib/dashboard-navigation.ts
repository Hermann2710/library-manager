import { 
  LayoutDashboard, BookOpen, Users, History, ShieldCheck, 
  Tags, PenTool, Building2, MapPin, BarChart3, Database, Search,
  Contact2, ClipboardList
} from "lucide-react";

// 1. Fonctionnalités communes (Lecteur, Bibliothécaire, Admin)
const commonNav = [
  { title: "Tableau de bord", url: "/dashboard", icon: LayoutDashboard },
  { title: "Catalogue", url: "/dashboard/search", icon: Search },
  { title: "Mes Emprunts", url: "/dashboard/my-loans", icon: History },
];

// 2. Fonctionnalités métier (Bibliothécaire + Admin)
const librarianNav = [
  { title: "Gestion Emprunts", url: "/dashboard/librarian/loans", icon: ClipboardList },
  { title: "Lecteurs (Membres)", url: "/dashboard/librarian/members", icon: Contact2 },
  { title: "Exemplaires", url: "/dashboard/librarian/items", icon: ShieldCheck },
  { title: "Ouvrages", url: "/dashboard/librarian/works", icon: BookOpen },
  { title: "Auteurs", url: "/dashboard/librarian/authors", icon: PenTool },
  { title: "Éditeurs", url: "/dashboard/librarian/publishers", icon: Building2 },
  { title: "Taxonomie", url: "/dashboard/librarian/taxonomy", icon: Tags },
  { title: "Emplacements", url: "/dashboard/librarian/locations", icon: MapPin },
];

// 3. Fonctionnalités système (Admin uniquement)
const adminNav = [
  { title: "Utilisateurs (Comptes)", url: "/dashboard/admin/users", icon: Users },
  { title: "Statistiques", url: "/dashboard/admin/stats", icon: BarChart3 },
];

export const DASHBOARD_CONFIG = {
  // Le reader ne voit que le commun
  reader: [...commonNav],
  
  // Le librarian voit le métier + le commun
  librarian: [...commonNav, ...librarianNav],
  
  // L'admin voit TOUT
  admin: [...commonNav, ...librarianNav, ...adminNav],
};