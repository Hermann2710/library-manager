"use client"

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLoans } from "@/actions/loan-actions";
import { DataTable } from "@/components/shared/data-table";
import { getLoanColumns } from "@/components/dashboard/loans/columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, Clock, CheckCircle2, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DashboardContainer } from "@/components/shared/dashboard-container";

export default function LibrarianLoansPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const { data = [], isLoading } = useQuery({
        queryKey: ["loans"],
        queryFn: () => getLoans()
    });

    const filteredData = data.filter((loan: any) => {
        const search = searchTerm.toLowerCase();
        const title = loan.item?.work?.title?.toLowerCase() || "";
        const memberName = loan.member?.user?.name?.toLowerCase() || "";
        return title.includes(search) || memberName.includes(search);
    });

    const pendingLoans = filteredData.filter((l: any) => l.status === "Pending");
    const activeLoans = filteredData.filter((l: any) => l.status === "Active" || l.status === "Overdue");

    return (
        <DashboardContainer
            title="GESTION DES EMPRUNTS"
            subtitle="Opérations"
            description="Validez les réservations en attente et suivez les exemplaires actuellement en circulation."
            actions={
                <div className="relative w-full sm:w-80 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Rechercher un membre ou un titre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-10 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary rounded-full text-xs font-medium"
                    />
                </div>
            }
        >
            <Tabs defaultValue="pending" className="w-full space-y-6">
                <TabsList className="bg-muted/50 p-1 h-12 rounded-xl inline-flex w-full sm:w-auto">
                    <TabsTrigger
                        value="pending"
                        className="gap-2 px-6 font-black uppercase text-[10px] tracking-widest italic"
                    >
                        <Clock className="h-4 w-4" /> À valider ({pendingLoans.length})
                    </TabsTrigger>
                    <TabsTrigger
                        value="active"
                        className="gap-2 px-6 font-black uppercase text-[10px] tracking-widest italic"
                    >
                        <CheckCircle2 className="h-4 w-4" /> En cours ({activeLoans.length})
                    </TabsTrigger>
                </TabsList>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 bg-muted/5 rounded-[2.5rem] border border-dashed">
                        <Loader2 className="h-10 w-10 animate-spin text-primary/20" />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                            Analyse du registre...
                        </p>
                    </div>
                ) : (
                    <div className="rounded-md p-4 border bg-card shadow-sm overflow-hidden animate-in fade-in duration-500">
                        <TabsContent value="pending" className="m-0 outline-none">
                            <DataTable columns={getLoanColumns()} data={pendingLoans} />
                        </TabsContent>

                        <TabsContent value="active" className="m-0 outline-none">
                            <DataTable columns={getLoanColumns()} data={activeLoans} />
                        </TabsContent>
                    </div>
                )}
            </Tabs>
        </DashboardContainer>
    );
}