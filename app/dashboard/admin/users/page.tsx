import { DashboardContainer } from "@/components/shared/dashboard-container";
import { ShieldAlert } from "lucide-react";
import { UsersTable } from "./_components/users-table";

export default function AdminUsersPage() {
  return (
    <DashboardContainer
      title="GESTION DES COMPTES"
      subtitle="Administration"
      description="Controlez les acces utilisateurs, modifiez les permissions et revoquez les acces au systeme."
      actions={
        <div className="flex items-center gap-3 rounded-md border border-rose-500/20 bg-rose-500/10 px-4 py-2 text-rose-600 shadow-sm shadow-rose-500/5">
          <ShieldAlert className="h-4 w-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Zone Critique</span>
        </div>
      }
    >
      <UsersTable />
    </DashboardContainer>
  );
}
