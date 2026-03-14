import { getAdminDashboardStats } from "@/actions/stats-actions";
import { StatsCharts } from "../stats/stats-charts";

/**
 * AdminView Component.
 * The ultimate command center for library administrators. 
 * It fetches and displays high-level analytics, from book performance to category trends.
 */
export default async function AdminView() {
    // Server-side data fetching to ensure the admin gets the freshest analytics on load
    const stats = await getAdminDashboardStats();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Analytics Header: Sets the tone for the data-driven insights below */}
            <header className="space-y-1 px-1">
                <h2 className="text-xs font-black uppercase tracking-widest text-primary">
                    Analyse Globale
                </h2>
                <p className="text-sm text-muted-foreground font-medium italic">
                    Performances et catalogue de la bibliothèque en temps réel.
                </p>
            </header>

            {/* StatsCharts: 
                The visualization layer. It breaks down complex database 
                relationships into digestible charts (Books, Authors, Genres, etc.).
            */}
            <section className="animate-in fade-in zoom-in-95 duration-700 delay-300">
                <StatsCharts
                    topBooks={stats.topBooks}
                    topAuthors={stats.topAuthors}
                    topCategories={stats.topCategories}
                    topGenres={stats.topGenres}
                />
            </section>
        </div>
    );
}