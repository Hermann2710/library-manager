"use client"

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLoans } from "@/actions/loan-actions";
import { DataTable } from "@/components/shared/data-table";
import { getLoanColumns } from "@/components/dashboard/loans/columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, CheckCircle2, Search, Loader2, ClipboardList } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DashboardContainer } from "@/components/shared/dashboard-container";
import { cn } from "@/lib/utils";

/**
 * LibrarianLoansPage Component:
 * The primary operations hub for library staff.
 * Handles the validation of reservation queues and real-time tracking of active loans.
 */
export default function LibrarianLoansPage() {
    const [searchTerm, setSearchTerm] = useState("");

    /**
     * Data Hydration:
     * Fetches all loan records. 
     * Filtering is handled on the client-side for near-instant search feedback.
     */
    const { data = [], isLoading } = useQuery({
        queryKey: ["loans"],
        queryFn: () => getLoans()
    });

    /**
     * Search Logic:
     * Filters loans based on the work title or the member's name.
     */
    const filteredData = data.filter((loan: any) => {
        const search = searchTerm.toLowerCase();
        const title = loan.item?.work?.title?.toLowerCase() || "";
        const memberName = loan.member?.user?.name?.toLowerCase() || "";
        return title.includes(search) || memberName.includes(search);
    });

    // Segmenting data for the specialized Tabs
    const pendingLoans = filteredData.filter((l: any) => l.status === "Pending");
    const activeLoans = filteredData.filter((l: any) => l.status === "Active" || l.status === "Overdue");

    return (
        <DashboardContainer
            title="GESTION DES EMPRUNTS"
            subtitle="Opérations"
            description="Validez les réservations en attente et suivez les exemplaires actuellement en circulation."
            actions={
                <div className="relative w-full sm:w-80 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Rechercher un membre ou un titre..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-11 h-12 bg-card border-border/40 focus-visible:ring-primary/20 rounded-2xl text-[11px] font-bold uppercase tracking-tight shadow-sm transition-all"
                    />
                </div>
            }
        >
            <Tabs defaultValue="pending" className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* TAB NAVIGATION: Using the Heavy-Rounded design system */}
                <TabsList className="bg-muted/30 p-1.5 h-14 rounded-[1.5rem] border border-border/20 inline-flex w-full sm:w-auto shadow-inner">
                    <TabsTrigger
                        value="pending"
                        className="gap-2 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest italic data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-primary transition-all"
                    >
                        <Clock className="h-4 w-4" />
                        À valider
                        <span className="ml-2 bg-primary/10 text-primary px-2 py-0.5 rounded-md text-[9px]">{pendingLoans.length}</span>
                    </TabsTrigger>
                    <TabsTrigger
                        value="active"
                        className="gap-2 px-8 rounded-xl font-black uppercase text-[10px] tracking-widest italic data-[state=active]:bg-background data-[state=active]:shadow-lg data-[state=active]:text-emerald-600 transition-all"
                    >
                        <CheckCircle2 className="h-4 w-4" />
                        En cours
                        <span className="ml-2 bg-emerald-500/10 text-emerald-600 px-2 py-0.5 rounded-md text-[9px]">{activeLoans.length}</span>
                    </TabsTrigger>
                </TabsList>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-24 gap-4 bg-card/50 backdrop-blur-sm rounded-[3rem] border border-dashed border-border/60">
                        <div className="p-5 bg-background rounded-3xl shadow-xl border border-border/20">
                            <Loader2 className="h-10 w-10 animate-spin text-primary" />
                        </div>
                        <div className="text-center">
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-foreground">
                                Analyse du registre
                            </p>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground italic">
                                Synchronisation des flux de prêt...
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="relative group">
                        {/* Decorative Background Glow */}
                        <div className="absolute -inset-1 bg-linear-to-r from-primary/5 to-emerald-500/5 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>

                        <div className="relative rounded-[2.5rem] p-2 border border-border/40 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
                            <TabsContent value="pending" className="m-0 outline-none animate-in fade-in zoom-in-95 duration-300">
                                <DataTable columns={getLoanColumns()} data={pendingLoans} />
                            </TabsContent>

                            <TabsContent value="active" className="m-0 outline-none animate-in fade-in zoom-in-95 duration-300">
                                <DataTable columns={getLoanColumns()} data={activeLoans} />
                            </TabsContent>
                        </div>
                    </div>
                )}

                {/* STATUS SUMMARY FOOTER */}
                {!isLoading && (
                    <div className="flex items-center gap-4 p-6 bg-primary/5 rounded-[2rem] border border-dashed border-primary/20">
                        <div className="p-3 bg-background rounded-2xl shadow-sm border border-border/10">
                            <ClipboardList className="h-5 w-5 text-primary/60" />
                        </div>
                        <div className="space-y-0.5">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary/80">Résumé des Opérations</h4>
                            <p className="text-[10px] text-muted-foreground italic font-medium">
                                {pendingLoans.length} réservations attendent votre approbation. {activeLoans.length} livres sont actuellement hors rayon.
                            </p>
                        </div>
                    </div>
                )}
            </Tabs>
        </DashboardContainer>
    );
}