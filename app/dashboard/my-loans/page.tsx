import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import { Loan } from "@/lib/models/Loan";
import { Member } from "@/lib/models/Member";
import "@/lib/models/Item";
import "@/lib/models/Work";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, BookCheck, History } from "lucide-react";
import { LoanCard } from "@/components/dashboard/my-loans/loan-card";

export default async function MyLoansPage() {
    await dbConnect();
    const session = await auth();
    if (!session) redirect("/login");

    const member = await Member.findOne({ user: session.user.id });
    if (!member) return <div className="p-8 text-center">Profil membre non trouvé.</div>;

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
        <div className="flex flex-col gap-8 p-4 md:p-8 max-w-5xl mx-auto">
            <header className="flex flex-col gap-1">
                <h1 className="text-3xl font-black tracking-tight">MES EMPRUNTS</h1>
                <p className="text-muted-foreground text-sm uppercase tracking-widest font-semibold">
                    Suivi de vos lectures et réservations
                </p>
            </header>

            <Tabs defaultValue="active" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 h-12">
                    <TabsTrigger value="active" className="gap-2 font-bold">
                        <BookCheck className="h-4 w-4" /> En cours ({active.length})
                    </TabsTrigger>
                    <TabsTrigger value="pending" className="gap-2 font-bold">
                        <Clock className="h-4 w-4" /> Réservations ({pending.length})
                    </TabsTrigger>
                    <TabsTrigger value="history" className="gap-2 font-bold">
                        <History className="h-4 w-4" /> Historique
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="active" className="mt-6 space-y-4">
                    {active.length > 0 ? (
                        active.map((loan: any) => <LoanCard key={loan._id} loan={loan} />)
                    ) : (
                        <EmptyState message="Aucun emprunt actif pour le moment." />
                    )}
                </TabsContent>

                <TabsContent value="pending" className="mt-6 space-y-4">
                    {pending.length > 0 ? (
                        pending.map((loan: any) => <LoanCard key={loan._id} loan={loan} />)
                    ) : (
                        <EmptyState message="Vous n'avez aucune réservation en attente." />
                    )}
                </TabsContent>

                <TabsContent value="history" className="mt-6 space-y-4">
                    {finished.length > 0 ? (
                        finished.map((loan: any) => <LoanCard key={loan._id} loan={loan} />)
                    ) : (
                        <EmptyState message="Votre historique est vide." />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-2xl opacity-40">
            <p className="text-sm font-medium italic">{message}</p>
        </div>
    );
}