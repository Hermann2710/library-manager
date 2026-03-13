"use client"

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, RotateCcw, Loader2 } from "lucide-react";
import { validateLoan, returnItem } from "@/actions/loan-actions";
import { toast } from "sonner";
import { useQueryClient, useMutation } from "@tanstack/react-query";

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
            return <Badge variant={variants[status]} className="font-bold">{status}</Badge>;
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const loan = row.original;
            const queryClient = useQueryClient();

            // Mutation pour valider
            const validateMutation = useMutation({
                mutationFn: () => validateLoan(loan._id),
                onSuccess: (res: any) => {
                    if (res.success) {
                        toast.success("Prêt validé");
                        queryClient.invalidateQueries({ queryKey: ["loans"] });
                    } else {
                        toast.error(res.error);
                    }
                }
            });

            // Mutation pour retourner
            const returnMutation = useMutation({
                mutationFn: () => returnItem(loan._id),
                onSuccess: (res: any) => {
                    if (res.success) {
                        toast.success("Livre rendu et remis en stock");
                        queryClient.invalidateQueries({ queryKey: ["loans"] });
                    } else {
                        toast.error(res.error);
                    }
                }
            });

            const isLoading = validateMutation.isPending || returnMutation.isPending;

            return (
                <div className="flex gap-2">
                    {loan.status === "Pending" && (
                        <Button
                            size="sm"
                            disabled={isLoading}
                            onClick={() => validateMutation.mutate()}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            {validateMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Check className="h-4 w-4 mr-1" />
                            )}
                            Valider
                        </Button>
                    )}
                    {loan.status === "Active" && (
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={isLoading}
                            onClick={() => returnMutation.mutate()}
                            className="border-primary text-primary hover:bg-primary/5"
                        >
                            {returnMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <RotateCcw className="h-4 w-4 mr-1" />
                            )}
                            Retour
                        </Button>
                    )}
                </div>
            );
        }
    }
];