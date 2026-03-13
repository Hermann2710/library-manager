import { getAdminDashboardStats } from "@/actions/stats-actions";
import { StatsCharts } from "../stats/stats-charts";

export default async function AdminView() {
    const stats = await getAdminDashboardStats();

    return (
        <div className="space-y-8">
            <header>
                <h2 className="text-xs font-black uppercase tracking-widest text-primary mb-1">Analyse Globale</h2>
                <p className="text-sm text-muted-foreground font-medium">Performances et catalogue de la bibliothèque.</p>
            </header>

            <StatsCharts
                topBooks={stats.topBooks}
                topAuthors={stats.topAuthors}
                topCategories={stats.topCategories}
                topGenres={stats.topGenres}
            />
        </div>
    );
}