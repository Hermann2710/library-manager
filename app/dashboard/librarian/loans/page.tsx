"use client"

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getLoans } from "@/actions/loan-actions";
import { DataTable } from "@/components/shared/data-table";
import { getLoanColumns } from "@/components/dashboard/loans/columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, Clock, CheckCircle2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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
        <div className="flex flex-col gap-8 p-8 max-w-7xl mx-auto">
            {/* Header & Recherche */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <ClipboardList className="h-6 w-6" />
                    </div>
                    <h1 className="text-2xl font-black tracking-tighter">GESTION DES EMPRUNTS</h1>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Rechercher..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-11 bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary"
                    />
                </div>
            </div>

            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="inline-flex bg-muted/50 p-1 h-11 mb-4">
                    <TabsTrigger value="pending" className="gap-2 px-6 font-bold text-xs uppercase tracking-widest">
                        <Clock className="h-4 w-4" /> À valider ({pendingLoans.length})
                    </TabsTrigger>
                    <TabsTrigger value="active" className="gap-2 px-6 font-bold text-xs uppercase tracking-widest">
                        <CheckCircle2 className="h-4 w-4" /> En cours ({activeLoans.length})
                    </TabsTrigger>
                </TabsList>

                {isLoading ? (
                    <TableSkeleton />
                ) : (
                    <>
                        <TabsContent value="pending" className="mt-0 outline-none">
                            {/* Suppression de la bordure et du shadow, on laisse la DataTable gérer son padding interne */}
                            <DataTable columns={getLoanColumns()} data={pendingLoans} />
                        </TabsContent>

                        <TabsContent value="active" className="mt-0 outline-none">
                            <DataTable columns={getLoanColumns()} data={activeLoans} />
                        </TabsContent>
                    </>
                )}
            </Tabs>
        </div>
    );
}

function TableSkeleton() {
    return (
        <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-xl opacity-50" />
            ))}
        </div>
    );
}