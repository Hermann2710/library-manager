"use client"

import { useQuery } from "@tanstack/react-query";
import { getLoans } from "@/actions/loan-actions";
import { DataTable } from "@/components/shared/data-table";
import { getLoanColumns } from "@/components/dashboard/loans/columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ClipboardList, Clock, CheckCircle2 } from "lucide-react";

export default function LibrarianLoansPage() {
    const { data = [], isLoading } = useQuery({
        queryKey: ["loans"],
        queryFn: () => getLoans()
    });

    const pendingLoans = data.filter((l: any) => l.status === "Pending");
    const activeLoans = data.filter((l: any) => l.status === "Active" || l.status === "Overdue");

    return (
        <div className="flex flex-col gap-6 p-8">
            <div className="flex items-center gap-4">
                <ClipboardList className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold">Gestion des Emprunts</h1>
            </div>

            <Tabs defaultValue="pending" className="w-full">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                    <TabsTrigger value="pending" className="gap-2">
                        <Clock className="h-4 w-4" />
                        À valider ({pendingLoans.length})
                    </TabsTrigger>
                    <TabsTrigger value="active" className="gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        En cours ({activeLoans.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-6">
                    <DataTable columns={getLoanColumns()} data={pendingLoans} loading={isLoading} />
                </TabsContent>

                <TabsContent value="active" className="mt-6">
                    <DataTable columns={getLoanColumns()} data={activeLoans} loading={isLoading} />
                </TabsContent>
            </Tabs>
        </div>
    );
}