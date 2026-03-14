export type UserRole = "admin" | "librarian" | "reader";

export interface DashboardUser {
  id: string;
  name: string;
  role: UserRole;
}

// Interface commune pour les petites cartes de stats (KPI)
export interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}