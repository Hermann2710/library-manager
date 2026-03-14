"use client"

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, RotateCcw, Loader2, BookOpen, User, CalendarClock } from "lucide-react";
import { validateLoan, returnItem } from "@/actions/loan-actions";
import { toast } from "sonner";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

/**
 * Loan Columns Configuration:
 * Defines the operational table for librarians. 
 * Integrates direct state mutations for validating or closing loans.
 */
export const getLoanColumns = (): ColumnDef<any>[] => [
    {
        accessorKey: "item.work.title",
        header: "Ouvrage",
        cell: ({ row }) => {
            const title = row.original.item?.work?.title;
            const barcode = row.original.item?.barcode;
            return (
                <div className="flex flex-col py-1">
                    <span className="font-black uppercase italic tracking-tighter text-sm leading-tight">
                        {title}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-muted-foreground/60 flex items-center gap-1.5 mt-0.5">
                        <BookOpen className="h-3 w-3" /> {barcode}
                    </span>
                </div>
            );
        }
    },
    {
        accessorKey: "member.user.name",
        header: "Lecteur",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center">
                    <User className="h-3.5 w-3.5 text-primary/60" />
                </div>
                <span className="font-bold text-xs uppercase tracking-tight">
                    {row.original.member?.user?.name}
                </span>
            </div>
        )
    },
    {
        accessorKey: "dueDate",
        header: "Échéance",
        cell: ({ row }) => {
            const date = row.original.dueDate;
            if (!date) return <span className="text-muted-foreground/40 italic text-[10px]">Non fixée</span>;

            const isOverdue = new Date(date) < new Date() && row.original.status !== "Returned";

            return (
                <div className={cn(
                    "flex items-center gap-2 text-[11px] font-black italic uppercase tracking-tighter",
                    isOverdue ? "text-rose-600" : "text-muted-foreground"
                )}>
                    <CalendarClock className="h-3.5 w-3.5" />
                    {new Date(date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                </div>
            );
        }
    },
    {
        accessorKey: "status",
        header: "Statut",
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            const config: any = {
                Pending: { label: "En attente", class: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
                Active: { label: "En cours", class: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-sm shadow-emerald-500/5" },
                Returned: { label: "Restitué", class: "bg-slate-100 text-slate-500 border-slate-200" },
                Overdue: { label: "Retard", class: "bg-rose-500/10 text-rose-600 border-rose-500/20 animate-pulse" }
            };
            const current = config[status] || { label: status, class: "" };

            return (
                <Badge className={cn(
                    "font-black text-[9px] uppercase tracking-[0.2em] px-3 py-1 rounded-full border shadow-none",
                    current.class
                )}>
                    {current.label}
                </Badge>
            );
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const loan = row.original;
            const queryClient = useQueryClient();

            /**
             * Validation Mutation:
             * Transitions a 'Pending' loan to 'Active'.
             */
            const validateMutation = useMutation({
                mutationFn: () => validateLoan(loan._id),
                onSuccess: (res: any) => {
                    if (res.success) {
                        toast.success("Security Clearance: Prêt validé avec succès");
                        queryClient.invalidateQueries({ queryKey: ["loans"] });
                    } else {
                        toast.error(res.error || "Échec de validation");
                    }
                }
            });

            /**
             * Return Mutation:
             * Handles the physical return of the item and resets its status in stock.
             */
            const returnMutation = useMutation({
                mutationFn: () => returnItem(loan._id),
                onSuccess: (res: any) => {
                    if (res.success) {
                        toast.success("Logistique: Exemplaire réintégré au stock");
                        queryClient.invalidateQueries({ queryKey: ["loans"] });
                    } else {
                        toast.error(res.error || "Erreur lors du retour");
                    }
                }
            });

            const isLoading = validateMutation.isPending || returnMutation.isPending;

            return (
                <div className="flex gap-2 justify-end">
                    {loan.status === "Pending" && (
                        <Button
                            size="sm"
                            disabled={isLoading}
                            onClick={() => validateMutation.mutate()}
                            className="bg-primary hover:bg-primary/90 text-white rounded-xl font-black uppercase text-[9px] tracking-widest italic h-9 px-4 shadow-lg shadow-primary/20 transition-all hover:scale-105"
                        >
                            {validateMutation.isPending ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <>
                                    <Check className="h-3.5 w-3.5 mr-1.5" />
                                    Approuver
                                </>
                            )}
                        </Button>
                    )}
                    {(loan.status === "Active" || loan.status === "Overdue") && (
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={isLoading}
                            onClick={() => returnMutation.mutate()}
                            className="border-emerald-500/30 text-emerald-600 hover:bg-emerald-50 rounded-xl font-black uppercase text-[9px] tracking-widest italic h-9 px-4 transition-all hover:scale-105"
                        >
                            {returnMutation.isPending ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                                <>
                                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                                    Clôturer
                                </>
                            )}
                        </Button>
                    )}
                </div>
            );
        }
    }
];