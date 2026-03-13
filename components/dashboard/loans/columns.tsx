"use client"

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, RotateCcw } from "lucide-react";
import { validateLoan, returnItem } from "@/actions/loan-actions";
import { toast } from "sonner";

export const getLoanColumns = (): ColumnDef<any>[] => [
    {
        accessorKey: "item.work.title",
        header: "Livre",
    },
    {
        accessorKey: "member.user.name",
        header: "Lecteur",
    },
    {
        accessorKey: "status",
        header: "Statut",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            const variants: any = {
                Pending: "outline",
                Active: "default",
                Returned: "secondary",
                Overdue: "destructive"
            };
            return <Badge variant={variants[status]}>{status}</Badge>;
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const loan = row.original;

            return (
                <div className="flex gap-2">
                    {loan.status === "Pending" && (
                        <Button
                            size="sm"
                            onClick={async () => {
                                const res = await validateLoan(loan._id);
                                if (res.success) toast.success("Prêt validé");
                            }}
                        >
                            <Check className="h-4 w-4 mr-1" /> Valider
                        </Button>
                    )}
                    {loan.status === "Active" && (
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                                const res = await returnItem(loan._id);
                                if (res.success) toast.success("Livre rendu");
                            }}
                        >
                            <RotateCcw className="h-4 w-4 mr-1" /> Retour
                        </Button>
                    )}
                </div>
            );
        }
    }
];