import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardContainer } from "@/components/shared/dashboard-container";
import AdminView from "@/components/dashboard/views/admin-view";
import MemberView from "@/components/dashboard/views/member-view";
import LibrarianView from "@/components/dashboard/views/librairian-view";
import { UserRole } from "@/lib/dashboard";

export default async function DashboardPage() {
    const session = await auth();
    if (!session) redirect("/login");

    const role = session.user.role as UserRole;
    const firstName = session.user.name?.split(' ')[0];

    return (
        <DashboardContainer
            subtitle="Tableau de bord"
            title={`Salut, ${firstName}`}
            actions={
                <span className="text-[9px] font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-full uppercase tracking-widest border border-primary/20">
                    Statut : {role}
                </span>
            }
        >
            <Suspense fallback={<div className="h-96 w-full bg-muted/10 animate-pulse rounded-3xl border border-dashed" />}>
                {role === "admin" && <AdminView />}
                {role === "librarian" && <LibrarianView />}
                {role === "member" && <MemberView user={session.user} />}
            </Suspense>
        </DashboardContainer>
    );
}