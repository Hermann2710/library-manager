import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookUp, Users, ClipboardCheck, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getLibrarianDashboardStats } from "@/actions/stats-actions";

/**
 * Operational Skeleton:
 * Prevents layout jumping while the librarian stats are loading.
 */
function LibrarianSkeleton() {
    return (
        <div className="grid gap-6 md:grid-cols-3 animate-pulse">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 bg-muted/20 rounded-3xl" />
            ))}
        </div>
    );
}

/**
 * RealLibrarianStats Component:
 * Fetches and displays the live operational data.
 */
async function RealLibrarianStats() {
    const stats = await getLibrarianDashboardStats();

    return (
        <>
            <LibrarianStat
                title="Prêts à valider"
                value={stats.pendingLoans}
                icon={ClipboardCheck}
                color="text-amber-500"
                delay="delay-0"
            />
            <LibrarianStat
                title="Retours du jour"
                value={stats.returnsToday}
                icon={BookUp}
                color="text-blue-500"
                delay="delay-75"
            />
            <LibrarianStat
                title="Nouveaux Membres"
                value={stats.newMembersToday}
                icon={Users}
                color="text-emerald-500"
                delay="delay-150"
            />
        </>
    );
}

export function LibrarianView() {
    return (
        <div className="space-y-6">
            {/* Contextual Header */}
            <header className="space-y-1">
                <h2 className="text-xs font-black uppercase tracking-widest text-primary animate-pulse">
                    Gestionnaire de Flux
                </h2>
                <p className="text-sm text-muted-foreground font-medium italic">
                    Suivi en temps réel des activités de prêt et des membres.
                </p>
            </header>

            <Suspense fallback={<LibrarianSkeleton />}>
                <div className="grid gap-6 md:grid-cols-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <RealLibrarianStats />
                </div>
            </Suspense>

            {/* Activity Feed Placeholder */}
            <Card className="border-none bg-muted/20 backdrop-blur-sm rounded-3xl overflow-hidden shadow-sm">
                <CardHeader className="border-b border-border/40 bg-muted/10 flex flex-row items-center justify-between">
                    <CardTitle className="text-xs font-black uppercase italic tracking-widest text-primary">
                        Dernières Actions
                    </CardTitle>
                    <button className="text-[10px] font-bold uppercase flex items-center gap-1 hover:underline text-muted-foreground">
                        Historique complet <ArrowRight className="h-3 w-3" />
                    </button>
                </CardHeader>
                <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center text-center">
                    <div className="h-14 w-14 rounded-2xl bg-background shadow-inner flex items-center justify-center mb-4 border border-dashed border-border">
                        <ClipboardCheck className="h-6 w-6 text-muted-foreground/30" />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                        Aucune demande critique en attente.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}

function LibrarianStat({ title, value, icon: Icon, color, delay }: any) {
    return (
        <Card className={cn(
            "border-none bg-muted/20 backdrop-blur-sm rounded-3xl transition-all hover:bg-muted/30 group animate-in zoom-in-95 duration-500",
            delay
        )}>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/70">
                            {title}
                        </p>
                        <p className="text-4xl font-black italic tracking-tighter">
                            {value}
                        </p>
                    </div>
                    <div className={cn(
                        "p-4 rounded-2xl bg-background shadow-sm transition-all group-hover:shadow-md group-hover:-translate-y-1",
                        color
                    )}>
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}