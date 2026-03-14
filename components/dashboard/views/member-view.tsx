// components/dashboard/member-view.tsx
import { Suspense } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, Clock, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMemberDashboardStats } from "@/actions/stats-actions";

/**
 * Loading Skeleton:
 * Mimics the layout of the stats cards to prevent layout shift during fetch.
 */
function StatsSkeleton() {
    return (
        <div className="grid gap-6 md:grid-cols-3 animate-pulse">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-muted/20 rounded-3xl" />
            ))}
        </div>
    );
}

/**
 * Async Wrapper for the Stats:
 * This is what Suspense waits for.
 */
async function RealStats({ userId }: { userId: string }) {
    const stats = await getMemberDashboardStats(userId);

    return (
        <>
            <QuickStat title="Livres empruntés" value={stats.loans} icon={BookOpen} delay="delay-0" />
            <QuickStat title="À rendre bientôt" value={stats.dueSoon} icon={Clock} delay="delay-75" />
            <QuickStat title="Retards" value={stats.overdue} icon={AlertCircle} color="text-destructive" delay="delay-150" />

            <Card className="md:col-span-3 border-none bg-muted/20 backdrop-blur-sm rounded-3xl overflow-hidden shadow-sm mt-6">
                <CardHeader className="border-b border-border/40 bg-muted/10 pb-4">
                    <CardTitle className="text-xs font-black uppercase italic tracking-widest text-primary">
                        Mes emprunts en cours
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-8 pb-12">
                    {stats.activeLoansList.length > 0 ? (
                        <div className="space-y-4 w-full">
                            {/* List of active loans would be rendered here */}
                            {stats.activeLoansList.map((loan: any) => (
                                <div key={loan._id} className="flex justify-between items-center text-sm p-2 border-b border-border/10">
                                    <span className="font-bold">{loan.item.work.title}</span>
                                    <span className="text-muted-foreground text-xs uppercase italic">
                                        Retour le: {new Date(loan.dueDate).toLocaleDateString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4 opacity-50">
                                <BookOpen className="h-6 w-6 text-muted-foreground" />
                            </div>
                            <p className="text-xs text-muted-foreground font-bold uppercase tracking-tight">
                                Aucun emprunt actif pour le moment.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
}

export default function MemberView({ user }: { user: any }) {
    return (
        <div className="space-y-6">
            <Suspense fallback={<StatsSkeleton />}>
                {/* We pass the User ID to fetch member-specific data */}
                <div className="grid gap-6 md:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <RealStats userId={user.id} />
                </div>
            </Suspense>
        </div>
    );
}

function QuickStat({ title, value, icon: Icon, color = "text-primary", delay }: any) {
    return (
        <Card className={cn(
            "border-none bg-muted/20 backdrop-blur-sm rounded-3xl transition-all hover:bg-muted/30 group animate-in zoom-in-95 duration-500",
            delay
        )}>
            <CardContent className="pt-6 flex items-center justify-between">
                <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/70">
                        {title}
                    </p>
                    <p className="text-3xl font-black italic">
                        {value}
                    </p>
                </div>
                <div className={cn(
                    "p-3 rounded-2xl bg-background/50 shadow-sm transition-transform group-hover:scale-110 group-hover:rotate-3",
                    color
                )}>
                    <Icon className="h-6 w-6" />
                </div>
            </CardContent>
        </Card>
    );
}