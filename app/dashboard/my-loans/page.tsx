import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Loader2, Briefcase } from "lucide-react";
import { DashboardContainer } from "@/components/shared/dashboard-container";
import { LoansListWrapper } from "@/components/dashboard/my-loans/loans-list-wrapper";

export default async function MyLoansPage() {
    const session = await auth();
    if (!session) redirect("/login");

    return (
        <DashboardContainer
            title="MES EMPRUNTS"
            subtitle="Lectures"
            description="Suivez l'état de vos emprunts actifs, vos réservations et votre historique de lecture."
            actions={
                <div className="bg-primary/10 p-2 rounded-lg">
                    <Briefcase className="h-5 w-5 text-primary" />
                </div>
            }
        >
            <Suspense
                fallback={
                    <div className="flex flex-col items-center justify-center py-32 gap-4 bg-muted/5 rounded-3xl border border-dashed">
                        <Loader2 className="h-10 w-10 animate-spin text-primary/20" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground animate-pulse">
                            Récupération de votre dossier...
                        </p>
                    </div>
                }
            >
                <LoansListWrapper userId={session.user.id!} />
            </Suspense>
        </DashboardContainer>
    );
}