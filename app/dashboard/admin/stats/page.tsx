import { Suspense } from "react";
import { getAdminDashboardStats } from "@/actions/stats-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, Clock, AlertTriangle, ShieldCheck, Trophy, BarChart3, Loader2 } from "lucide-react";
import { StatsCharts } from "@/components/dashboard/stats/stats-charts";
import { DashboardContainer } from "@/components/shared/dashboard-container";

/**
 * StatsContent Component:
 * Fetches high-level metrics and ranking data from the Server Action.
 * It populates the KPI cards and passes complex datasets to the chart components.
 */
async function StatsContent() {
    // Fetching comprehensive system statistics in a single server roundtrip
    const { counts, topReaders, topBooks, topAuthors, topCategories, topGenres, topPublishers } = await getAdminDashboardStats();

    // Mapping KPI data for efficient rendering and consistent styling
    const mainCards = [
        { title: "Prêts Actifs", value: counts.activeLoans, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-500/10" },
        { title: "À Valider", value: counts.pendingRes, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
        { title: "En Retard", value: counts.overdueLoans, icon: AlertTriangle, color: "text-destructive", bg: "bg-destructive/10" },
        { title: "Staff", value: counts.totalStaff, icon: ShieldCheck, color: "text-indigo-600", bg: "bg-indigo-500/10" },
    ];

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* KPI GRID: High-impact numbers for quick assessment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {mainCards.map((card) => (
                    <Card key={card.title} className="border-none shadow-none bg-card/40 backdrop-blur-sm border border-border/20 rounded-[2.5rem] transition-all hover:bg-card/60">
                        <CardHeader className="flex flex-row items-center justify-between pb-3 space-y-0">
                            <CardTitle className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/70">
                                {card.title}
                            </CardTitle>
                            <div className={`${card.bg} p-2.5 rounded-2xl shadow-inner`}>
                                <card.icon className={`h-4 w-4 ${card.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black tracking-[ -0.05em] italic">
                                {card.value}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* DATA VISUALIZATION: Trends and distributions */}
                <div className="lg:col-span-2 space-y-8">
                    <StatsCharts
                        topBooks={topBooks}
                        topAuthors={topAuthors}
                        topCategories={topCategories}
                        topGenres={topGenres}
                        topPublishers={topPublishers}
                    />
                </div>

                {/* RANKINGS: User performance and engagement */}
                <div className="space-y-6">
                    <Card className="border-none shadow-sm bg-card/50 border border-border/40 rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="flex flex-row items-center gap-3 bg-muted/20 pb-5 pt-6">
                            <div className="bg-amber-500/20 p-2 rounded-xl">
                                <Trophy className="h-5 w-5 text-amber-600" />
                            </div>
                            <CardTitle className="text-sm font-black uppercase tracking-tight italic">Meilleurs Lecteurs</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-8">
                            {(topReaders as Array<any>).map((reader, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-background/50 rounded-2xl border border-border/20 hover:border-primary/30 transition-all hover:translate-x-1">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                                                <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-black">
                                                    {reader.name.substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            {i < 3 && (
                                                <div className="absolute -top-1 -right-1 h-4 w-4 bg-amber-500 rounded-full border-2 border-background flex items-center justify-center">
                                                    <span className="text-[8px] font-black text-white">{i + 1}</span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-xs font-bold truncate max-w-30">{reader.name}</p>
                                    </div>
                                    <div className="bg-primary/5 px-4 py-1.5 rounded-full border border-primary/10">
                                        <p className="text-[10px] font-black text-primary">{reader.loanCount} <span className="opacity-60">PRÊTS</span></p>
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

/**
 * StatsLoading: Skeleton UI
 * Maintains the page structure during data fetch to prevent layout shifts.
 */
function StatsLoading() {
    return (
        <div className="space-y-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-36 bg-muted/20 rounded-[2.5rem] animate-pulse" />
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
                <div className="flex items-center gap-3 bg-primary/10 text-primary px-5 py-2 rounded-full border border-primary/20 shadow-sm shadow-primary/5">
                    <BarChart3 className="h-4 w-4 animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest italic">Live Monitor</span>
                </div>
            }
        >
            <Suspense fallback={<StatsLoading />}>
                <StatsContent />
            </Suspense>
        </DashboardContainer>
    );
}