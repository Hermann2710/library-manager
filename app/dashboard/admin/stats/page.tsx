import { Suspense } from "react";
import { getAdminDashboardStats } from "@/actions/stats-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, Users, Clock, AlertTriangle, ShieldCheck, Trophy } from "lucide-react";
import { StatsCharts } from "@/components/dashboard/stats/stats-charts";
import { Skeleton } from "@/components/ui/skeleton";

// 1. Le composant qui charge les données
async function StatsContent() {
    const { counts, topReaders, topBooks, topAuthors, topCategories, topGenres, topPublishers } = await getAdminDashboardStats();

    const mainCards = [
        { title: "Prêts Actifs", value: counts.activeLoans, icon: BookOpen, color: "text-blue-600" },
        { title: "À Valider", value: counts.pendingRes, icon: Clock, color: "text-amber-500" },
        { title: "En Retard", value: counts.overdueLoans, icon: AlertTriangle, color: "text-destructive" },
        { title: "Staff", value: counts.totalStaff, icon: ShieldCheck, color: "text-indigo-600" },
    ];

    return (
        <div className="space-y-10">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {mainCards.map((card) => (
                    <Card key={card.title} className="border-none shadow-none bg-muted/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">{card.title}</CardTitle>
                            <card.icon className={`h-4 w-4 ${card.color}`} />
                        </CardHeader>
                        <CardContent><div className="text-3xl font-black">{card.value}</div></CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 space-y-8">
                    <StatsCharts
                        topBooks={topBooks}
                        topAuthors={topAuthors}
                        topCategories={topCategories}
                        topGenres={topGenres}
                        topPublishers={topPublishers}
                    />
                </div>

                <div className="space-y-6">
                    <Card className="border-none shadow-sm bg-muted/10 border border-muted/20">
                        <CardHeader className="flex flex-row items-center gap-2">
                            <Trophy className="h-5 w-5 text-amber-500" />
                            <CardTitle className="text-sm font-black uppercase tracking-tighter italic">Meilleurs Lecteurs</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {(topReaders as Array<any>).map((reader, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-background rounded-2xl border border-muted/10">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarFallback className="bg-primary text-[10px] text-white font-black">
                                                {reader.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <p className="text-xs font-bold truncate max-w-30">{reader.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black">{reader.loanCount} Prêts</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

// 2. Le fallback (ce qui s'affiche pendant le chargement)
function StatsLoading() {
    return (
        <div className="space-y-10 animate-pulse">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-muted/20 rounded-xl" />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 h-96 bg-muted/10 rounded-xl" />
                <div className="h-96 bg-muted/10 rounded-xl" />
            </div>
        </div>
    );
}

// 3. La page principale qui devient ultra rapide
export default function AdminStatsPage() {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter uppercase italic">Analytics</h1>
                    <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.4em]">Dashboard Libraire</p>
                </div>
            </header>

            <Suspense fallback={<StatsLoading />}>
                <StatsContent />
            </Suspense>
        </div>
    );
}