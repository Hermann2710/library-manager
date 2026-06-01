import { getAdminDashboardStats } from "@/actions/stats-actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, BookOpen, Clock, ShieldCheck, Trophy } from "lucide-react";
import { StatsCharts } from "@/components/dashboard/stats/stats-charts";

type TopReader = {
  name: string;
  loanCount: number;
};

export async function AdminStatsContent() {
  const { counts, topReaders, topBooks, topAuthors, topCategories, topGenres, topPublishers } = await getAdminDashboardStats();

  const mainCards = [
    { title: "Prets Actifs", value: counts.activeLoans, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-500/10" },
    { title: "A Valider", value: counts.pendingRes, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "En Retard", value: counts.overdueLoans, icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
    { title: "Staff", value: counts.totalStaff, icon: ShieldCheck, color: "text-indigo-600", bg: "bg-indigo-500/10" },
  ];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {mainCards.map((card) => (
          <Card key={card.title} className="border border-border/20 bg-card/40 shadow-none backdrop-blur-sm transition-all hover:bg-card/60">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/70">
                {card.title}
              </CardTitle>
              <div className={`${card.bg} rounded-md p-2.5 shadow-inner`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-black italic">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <StatsCharts
            topBooks={topBooks}
            topAuthors={topAuthors}
            topCategories={topCategories}
            topGenres={topGenres}
            topPublishers={topPublishers}
          />
        </div>

        <Card className="overflow-hidden border border-border/40 bg-card/50 shadow-sm">
          <CardHeader className="flex flex-row items-center gap-3 bg-muted/20 pb-5 pt-6">
            <div className="rounded-md bg-amber-500/20 p-2">
              <Trophy className="h-5 w-5 text-amber-600" />
            </div>
            <CardTitle className="text-sm font-black uppercase tracking-tight">Meilleurs Lecteurs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-8">
            {(topReaders as TopReader[]).map((reader, index) => (
              <div key={`${reader.name}-${index}`} className="flex items-center justify-between rounded-md border border-border/20 bg-background/50 p-4 transition-all hover:border-primary/30">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                      <AvatarFallback className="bg-primary/10 text-[10px] font-black text-primary">
                        {reader.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {index < 3 && (
                      <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full border-2 border-background bg-amber-500">
                        <span className="text-[8px] font-black text-white">{index + 1}</span>
                      </div>
                    )}
                  </div>
                  <p className="max-w-30 truncate text-xs font-bold">{reader.name}</p>
                </div>
                <div className="rounded-md border border-primary/10 bg-primary/5 px-4 py-1.5">
                  <p className="text-[10px] font-black text-primary">{reader.loanCount} <span className="opacity-60">PRETS</span></p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function AdminStatsLoading() {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-36 animate-pulse rounded-lg bg-muted/20" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="h-125 animate-pulse rounded-lg bg-muted/10 lg:col-span-2" />
        <div className="h-125 animate-pulse rounded-lg bg-muted/10" />
      </div>
    </div>
  );
}
