import { Suspense } from "react";
import { getAdminDashboardStats } from "@/actions/stats-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, Clock, AlertTriangle, ShieldCheck, Trophy, BarChart3, Loader2 } from "lucide-react";
import { StatsCharts } from "@/components/dashboard/stats/stats-charts";
import { DashboardContainer } from "@/components/shared/dashboard-container";

async function StatsContent() {
    const { counts, topReaders, topBooks, topAuthors, topCategories, topGenres, topPublishers } = await getAdminDashboardStats();

    const mainCards = [
        { title: "Prêts Actifs", value: counts.activeLoans, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-500/10" },
        { title: "À Valider", value: counts.pendingRes, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
        { title: "En Retard", value: counts.overdueLoans, icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
        { title: "Staff", value: counts.totalStaff, icon: ShieldCheck, color: "text-indigo-600", bg: "bg-indigo-500/10" },
    ];

    return (
        <div className="space-y-10">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {mainCards.map((card) => (
                    <Card key={card.title} className="border-none shadow-none bg-muted/20 rounded-[2rem]">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                {card.title}
                            </CardTitle>
                            <div className={`${card.bg} p-2 rounded-xl`}>
                                <card.icon className={`h-4 w-4 ${card.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black tracking-tighter">{card.value}</div>
                        </CardContent>
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
                    <Card className="border-none shadow-sm bg-muted/10 border border-muted/20 rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="flex flex-row items-center gap-3 bg-muted/20 pb-4">
                            <Trophy className="h-5 w-5 text-amber-500" />
                            <CardTitle className="text-sm font-black uppercase tracking-tighter italic">Meilleurs Lecteurs</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            {(topReaders as Array<any>).map((reader, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-background rounded-2xl border border-muted/10 hover:border-primary/20 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 border-2 border-muted">
                                            <AvatarFallback className="bg-primary text-[10px] text-primary-foreground font-black">
                                                {reader.name.substring(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <p className="text-xs font-bold truncate max-w-30">{reader.name}</p>
                                    </div>
                                    <div className="bg-muted/30 px-3 py-1 rounded-full">
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

function StatsLoading() {
    return (
        <div className="space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-32 bg-muted/20 rounded-[2rem] animate-pulse" />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2 h-125 bg-muted/10 rounded-[2.5rem] animate-pulse" />
                <div className="h-125 bg-muted/10 rounded-[2.5rem] animate-pulse" />
            </div>
        </div>
    );
}

export default function AdminStatsPage() {
    return (
        <DashboardContainer
            title="ANALYTICS"
            subtitle="Données Système"
            description="Vue d'ensemble des performances de la bibliothèque, des tendances de lecture et de l'activité du staff."
            actions={
                <div className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full border border-primary/20">
                    <BarChart3 className="h-4 w-4" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Temps Réel</span>
                </div>
            }
        >
            <Suspense fallback={<StatsLoading />}>
                <StatsContent />
            </Suspense>
        </DashboardContainer>
    );
}