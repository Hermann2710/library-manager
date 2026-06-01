import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock } from "lucide-react";
import type { ProfileData } from "../_actions/get-profile-data";
import { formatDate } from "./profile-types";

export function ActivityTab({ profileData }: { profileData: ProfileData }) {
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Actifs" value={profileData.stats.activeLoans} />
        <StatCard label="A valider" value={profileData.stats.pendingLoans} />
        <StatCard label="En retard" value={profileData.stats.overdueLoans} />
        <StatCard label="Retournes" value={profileData.stats.returnedLoans} />
      </div>

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CalendarClock className="h-5 w-5 text-primary" /> Derniers mouvements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {profileData.recentLoans.length > 0 ? profileData.recentLoans.map((loan) => (
            <div key={loan.id} className="flex flex-col gap-1 rounded-lg border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold">{loan.title}</p>
                <p className="text-xs text-muted-foreground">Retour prevu : {formatDate(loan.dueDate)}</p>
              </div>
              <Badge variant="outline" className="w-fit rounded-md">{loan.status}</Badge>
            </div>
          )) : (
            <p className="text-sm text-muted-foreground">Aucun mouvement recent.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-background p-4">
      <p className="text-2xl font-black">{value}</p>
      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}
