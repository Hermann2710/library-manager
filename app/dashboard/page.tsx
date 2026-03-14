import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { DashboardContainer } from "@/components/shared/dashboard-container";
import AdminView from "@/components/dashboard/views/admin-view";
import MemberView from "@/components/dashboard/views/member-view";
import { LibrarianView } from "@/components/dashboard/views/librairian-view";
import { UserRole } from "@/lib/dashboard";

/**
 * DashboardPage: The main entry point for authenticated users.
 * Now follows a "Personal First" philosophy: everyone sees their member stats, 
 * plus their professional tools if they have the rights.
 */
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
                <span className="text-[9px] font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-full uppercase tracking-widest border border-primary/20 animate-in fade-in zoom-in duration-700">
                    Mode : {role}
                </span>
            }
        >
            <Suspense
                fallback={
                    <div className="space-y-6">
                        <div className="h-32 w-full bg-muted/10 animate-pulse rounded-3xl" />
                        <div className="h-64 w-full bg-muted/10 animate-pulse rounded-3xl" />
                    </div>
                }
            >
                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">

                    {/* PROFESSIONAL TOOLS (TOP)
                        Only shown to staff to handle library operations.
                    */}
                    {role === "admin" && (
                        <section className="space-y-4">
                            <AdminView />
                            <div className="border-t border-dashed border-border/50 my-8" />
                        </section>
                    )}

                    {role === "librarian" && (
                        <section className="space-y-4">
                            <LibrarianView />
                            <div className="border-t border-dashed border-border/50 my-8" />
                        </section>
                    )}

                    {/* PERSONAL VIEW (BOTTOM)
                        Everyone is a reader. This section shows personal loans and activity.
                    */}
                    <section className="space-y-4">
                        <header>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 ml-1">
                                Mon Espace Lecteur
                            </h3>
                        </header>
                        <MemberView user={session.user} />
                    </section>
                </div>
            </Suspense>
        </DashboardContainer>
    );
}