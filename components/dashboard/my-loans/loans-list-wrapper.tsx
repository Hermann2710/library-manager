import dbConnect from "@/lib/mongodb";
import { Loan } from "@/lib/models/Loan";
import { Member } from "@/lib/models/Member";
import "@/lib/models/Item";
import "@/lib/models/Work";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, BookCheck, History } from "lucide-react";
import { LoanCard } from "@/components/dashboard/my-loans/loan-card";

export async function LoansListWrapper({ userId }: { userId: string }) {
    await dbConnect();

    const member = await Member.findOne({ user: userId });
    if (!member) {
        return (
            <div className="p-12 text-center bg-destructive/5 rounded-3xl border border-destructive/20 text-destructive font-bold uppercase text-xs tracking-widest">
                Profil membre non trouvé.
            </div>
        );
    }

    const loans = await Loan.find({ member: member._id })
        .populate({
            path: 'item',
            populate: { path: 'work', populate: { path: 'authors' } }
        })
        .sort({ createdAt: -1 })
        .lean();

    const plainLoans = JSON.parse(JSON.stringify(loans));

    const pending = plainLoans.filter((l: any) => l.status === "Pending");
    const active = plainLoans.filter((l: any) => l.status === "Active" || l.status === "Overdue");
    const finished = plainLoans.filter((l: any) => l.status === "Returned");

    return (
        <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 h-12 rounded-xl">
                <TabsTrigger value="active" className="gap-2 font-black uppercase text-[10px] tracking-tighter">
                    <BookCheck className="h-4 w-4" /> En cours ({active.length})
                </TabsTrigger>
                <TabsTrigger value="pending" className="gap-2 font-black uppercase text-[10px] tracking-tighter">
                    <Clock className="h-4 w-4" /> Réservations ({pending.length})
                </TabsTrigger>
                <TabsTrigger value="history" className="gap-2 font-black uppercase text-[10px] tracking-tighter">
                    <History className="h-4 w-4" /> Historique
                </TabsTrigger>
            </TabsList>

            <div className="mt-8 space-y-4">
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

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed rounded-[2rem] bg-muted/5 opacity-50">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground italic">
                {message}
            </p>
        </div>
    );
}