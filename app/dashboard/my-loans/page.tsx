import { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Loader2, Briefcase, BookOpen } from "lucide-react";
import { DashboardContainer } from "@/components/shared/dashboard-container";
import { LoansListWrapper } from "@/components/dashboard/my-loans/loans-list-wrapper";

/**
 * MyLoansPage: A dedicated view for the user's personal borrowing history.
 * It handles the server-side authentication check and delegates data 
 * fetching to a wrapped component within a Suspense boundary.
 */
export default async function MyLoansPage() {
    // Authenticating the user on the server to prevent unauthorized access
    const session = await auth();

    // Safety check: redirecting to login if no session is found
    if (!session) {
        redirect("/login");
    }

    return (
        <DashboardContainer
            title="MES EMPRUNTS"
            subtitle="Lectures"
            description="Suivez l'état de vos emprunts actifs, vos réservations et votre historique de lecture."
            actions={
                /* Page Action Decoration: Keeps the visual language consistent across the dashboard */
                <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20 shadow-sm shadow-primary/5">
                    <Briefcase className="h-5 w-5 text-primary" />
                </div>
            }
        >
            {/* Suspense Boundary:
                This ensures the dashboard shell is visible instantly while the
                database query for loans (which can be slow) is processed in the background.
            */}
            <Suspense
                fallback={
                    /* Premium Fallback State: Highlighting the brand's 'Heavy-Rounded' aesthetic */
                    <div className="flex flex-col items-center justify-center py-40 gap-6 bg-muted/20 backdrop-blur-sm rounded-[3rem] border border-dashed border-border/60 animate-in fade-in duration-500">
                        <div className="relative">
                            <Loader2 className="h-12 w-12 animate-spin text-primary/10" />
                            <Briefcase className="h-5 w-5 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40" />
                        </div>
                        <div className="space-y-1 text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground animate-pulse">
                                Récupération de votre dossier...
                            </p>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/30 italic">
                                Accès sécurisé à votre historique
                            </p>
                        </div>
                    </div>
                }
            >
                {/* The Wrapper:
                    Calls the server-side action to get specific loans for the current user.
                */}
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-1000">
                    <LoansListWrapper userId={session.user.id!} />
                </div>
            </Suspense>
        </DashboardContainer>
    );
}