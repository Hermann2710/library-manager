import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

// Import des vues spécifiques
import AdminView from "@/components/dashboard/views/admin-view";
import MemberView from "@/components/dashboard/views/member-view";
import LibrarianView from "@/components/dashboard/views/librairian-view";
import { UserRole } from "@/lib/dashboard";

export default async function DashboardPage() {
    const session = await auth();
    if (!session) redirect("/login");

    const role = session.user.role as UserRole;

    return (
        <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex justify-between items-end">
                <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                        Tableau de bord
                    </p>
                    <h1 className="text-3xl font-black uppercase italic leading-none">
                        Salut, {session.user.name?.split(' ')[0]}
                    </h1>
                </div>
                <div className="text-right hidden sm:block">
                    <span className="text-[9px] font-bold bg-primary/10 text-primary px-2 py-1 rounded-full uppercase tracking-tighter">
                        Statut : {role}
                    </span>
                </div>
            </header>

            <Suspense fallback={<div className="h-96 w-full bg-muted/10 animate-pulse rounded-3xl" />}>
                {role === "admin" && <AdminView />}
                {role === "librarian" && <LibrarianView />}
                {role === "member" && <MemberView user={session.user} />}
            </Suspense>
        </main>
    );
}