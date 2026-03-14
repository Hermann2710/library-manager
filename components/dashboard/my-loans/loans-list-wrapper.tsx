import dbConnect from "@/lib/mongodb";
import { Loan } from "@/lib/models/Loan";
import { Member } from "@/lib/models/Member";
import "@/lib/models/Item";
import "@/lib/models/Work";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, BookCheck, History, AlertCircle } from "lucide-react";
import { LoanCard } from "@/components/dashboard/my-loans/loan-card";

/**
 * LoansListWrapper: Server Component.
 * Fetches and categorizes user loans into Pending, Active, and Finished states.
 * It ensures the user is linked to a Member profile before querying.
 */
export async function LoansListWrapper({ userId }: { userId: string }) {
    await dbConnect();

    // Locating the member profile linked to the authenticated user
    const member = await Member.findOne({ user: userId });

    // Safety check: Handling cases where a user account exists but isn't a library member
    if (!member) {
        return (
            <div className="p-12 text-center bg-destructive/5 rounded-[2.5rem] border border-destructive/20 text-destructive flex flex-col items-center gap-3 animate-in shake duration-500">
                <AlertCircle className="h-8 w-8 opacity-40" />
                <p className="font-black uppercase text-[10px] tracking-[0.2em]">Profil membre non trouvé.</p>
            </div>
        );
    }

    /**
     * Deep Population:
     * We traverse from Loan -> Item -> Work -> Authors to get all 
     * necessary metadata for the LoanCard display.
     */
    const loans = await Loan.find({ member: member._id })
        .populate({
            path: 'item',
            populate: { path: 'work', populate: { path: 'authors' } }
        })
        .sort({ createdAt: -1 })
        .lean();

    // Standardizing MongoDB objects for safe Next.js serialization
    const plainLoans = JSON.parse(JSON.stringify(loans));

    // Categorizing loans by their lifecycle status
    const pending = plainLoans.filter((l: any) => l.status === "Pending");
    const active = plainLoans.filter((l: any) => l.status === "Active" || l.status === "Overdue");
    const finished = plainLoans.filter((l: any) => l.status === "Returned");

    return (
        <Tabs defaultValue="active" className="w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Tab Navigation: Designed with a modern, high-contrast look */}
            <TabsList className="grid w-full grid-cols-3 bg-muted/30 p-1.5 h-14 rounded-2xl border border-border/40 shadow-inner">
                <TabsTrigger value="active" className="gap-2 font-black uppercase text-[9px] md:text-[10px] tracking-widest rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                    <BookCheck className="h-4 w-4" /> En cours ({active.length})
                </TabsTrigger>
                <TabsTrigger value="pending" className="gap-2 font-black uppercase text-[9px] md:text-[10px] tracking-widest rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                    <Clock className="h-4 w-4" /> Réservations ({pending.length})
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-2 font-black uppercase text-[9px] md:text-[10px] tracking-widest rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white transition-all">
                    <History className="h-4 w-4" /> Historique
                </TabsTrigger>
            </TabsList>

            {/* List Containers: Each tab content has its own space with a slight margin */}
            <div className="mt-10 space-y-6">
                <TabsContent value="active" className="space-y-4 outline-none">
                    {active.length > 0 ? (
                        active.map((loan: any) => <LoanCard key={loan._id} loan={loan} />)
                    ) : (
                        <EmptyState message="Aucun emprunt actif pour le moment." />
                    )}
                </TabsContent>

                <TabsContent value="pending" className="space-y-4 outline-none">
                    {pending.length > 0 ? (
                        pending.map((loan: any) => <LoanCard key={loan._id} loan={loan} />)
                    ) : (
                        <EmptyState message="Vous n'avez aucune réservation en attente." />
                    )}
                </TabsContent>

                <TabsContent value="history" className="space-y-4 outline-none">
                    {finished.length > 0 ? (
                        finished.map((loan: any) => <LoanCard key={loan._id} loan={loan} />)
                    ) : (
                        <EmptyState message="Votre historique est vide." />
                    )}
                </TabsContent>
            </div>
        </Tabs>
    );
}

/**
 * EmptyState: A reusable subtle UI for tabs with no data.
 */
function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed rounded-[3rem] bg-muted/5 border-border/40">
            <div className="bg-background p-4 rounded-full shadow-sm border border-border/20 mb-4 opacity-40">
                <History className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 italic text-center px-4">
                {message}
            </p>
        </div>
    );
}