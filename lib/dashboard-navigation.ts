import {
  BarChart3,
  BookOpen,
  Building2,
  ClipboardList,
  Contact2,
  Database,
  History,
  LayoutDashboard,
  MapPin,
  PenTool,
  Search,
  ShieldCheck,
  Tags,
  Users,
} from "lucide-react";
import type { AppRole } from "@/lib/access-control";
import type { ComponentType } from "react";

type DashboardNavItem = {
  title: string;
  url: string;
  icon: ComponentType<{ className?: string }>;
};

type DashboardNavSection = {
  title: string;
  roles: AppRole[];
  items: DashboardNavItem[];
};

export const DASHBOARD_SECTIONS: DashboardNavSection[] = [
  {
    title: "Espace lecteur",
    roles: ["reader", "librarian", "admin"],
    items: [
      { title: "Tableau de bord", url: "/dashboard", icon: LayoutDashboard },
      { title: "Catalogue", url: "/dashboard/search", icon: Search },
      { title: "Mes emprunts", url: "/dashboard/my-loans", icon: History },
    ],
  },
  {
    title: "Bibliotheque",
    roles: ["librarian", "admin"],
    items: [
      { title: "Emprunts", url: "/dashboard/librarian/loans", icon: ClipboardList },
      { title: "Membres", url: "/dashboard/librarian/members", icon: Contact2 },
      { title: "Exemplaires", url: "/dashboard/librarian/items", icon: ShieldCheck },
      { title: "Ouvrages", url: "/dashboard/librarian/works", icon: BookOpen },
      { title: "Auteurs", url: "/dashboard/librarian/authors", icon: PenTool },
      { title: "Editeurs", url: "/dashboard/librarian/publishers", icon: Building2 },
      { title: "Taxonomie", url: "/dashboard/librarian/taxonomy", icon: Tags },
      { title: "Emplacements", url: "/dashboard/librarian/locations", icon: MapPin },
    ],
  },
  {
    title: "Administration",
    roles: ["admin"],
    items: [
      { title: "Comptes", url: "/dashboard/admin/users", icon: Users },
      { title: "Statistiques", url: "/dashboard/admin/stats", icon: BarChart3 },
      { title: "Donnees", url: "/dashboard/librarian/works", icon: Database },
    ],
  },
];

export function getDashboardSections(role: AppRole) {
  return DASHBOARD_SECTIONS.filter((section) => section.roles.includes(role));
}
