import { 
  LayoutDashboard, BookOpen, Users, History, ShieldCheck, 
  Tags, PenTool, Building2, MapPin, BarChart3, Database, Search 
} from "lucide-react";

// 1. Fonctionnalités communes à TOUS (Lecteur, Bibliothécaire, Admin)
const commonNav = [
  { title: "Ma Bibliothèque", url: "/dashboard", icon: LayoutDashboard },
  { title: "Recherche Livres", url: "/dashboard/search", icon: Search },
  { title: "Mes Emprunts", url: "/dashboard/loans", icon: History },
];

// 2. Fonctionnalités métier (Bibliothécaire + Admin)
const librarianNav = [
  { title: "Exemplaires (Items)", url: "/dashboard/librarian/items", icon: ShieldCheck },
  { title: "Catalogue (Œuvres)", url: "/dashboard/librarian/works", icon: BookOpen },
  { title: "Auteurs", url: "/dashboard/librarian/authors", icon: PenTool },
  { title: "Éditeurs", url: "/dashboard/librarian/publishers", icon: Building2 },
  { title: "Taxonomie", url: "/dashboard/librarian/taxonomy", icon: Tags },
  { title: "Emplacements", url: "/dashboard/librarian/locations", icon: MapPin },
];

// 3. Fonctionnalités système (Admin uniquement)
const adminNav = [
  { title: "Utilisateurs", url: "/dashboard/admin/users", icon: Users },
  { title: "Statistiques", url: "/dashboard/admin/stats", icon: BarChart3 },
  { title: "Logs Système", url: "/dashboard/admin/logs", icon: Database },
];

export const DASHBOARD_CONFIG = {
  // Le reader ne voit que le commun
  reader: [...commonNav],
  
  // Le librarian voit le sien + le commun
  librarian: [...commonNav, ...librarianNav],
  
  // L'admin voit TOUT
  admin: [...commonNav, ...librarianNav, ...adminNav],
};