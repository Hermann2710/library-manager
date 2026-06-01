import { Suspense } from "react";
import { DashboardContainer } from "@/components/shared/dashboard-container";
import { BarChart3 } from "lucide-react";
import { AdminStatsContent, AdminStatsLoading } from "./_components/admin-stats-content";

export default function AdminStatsPage() {
  return (
    <DashboardContainer
      title="ANALYTICS"
      subtitle="Donnees Systeme"
      description="Vue d'ensemble des performances de la librairie, des tendances de lecture et de l'activite du staff."
      actions={
        <div className="flex items-center gap-3 rounded-md border border-primary/20 bg-primary/10 px-4 py-2 text-primary shadow-sm shadow-primary/5">
          <BarChart3 className="h-4 w-4 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest">Live Monitor</span>
        </div>
      }
    >
      <Suspense fallback={<AdminStatsLoading />}>
        <AdminStatsContent />
      </Suspense>
    </DashboardContainer>
  );
}
