"use client";

import { returnItem, rejectLoan, validateLoan } from "@/actions/loan-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { BookOpen, CalendarClock, Check, Loader2, RotateCcw, User, XCircle } from "lucide-react";
import { toast } from "sonner";

const statusConfig: Record<string, { label: string; className: string }> = {
  Pending: { label: "En attente", className: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
  Active: { label: "En cours", className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-sm shadow-emerald-500/5" },
  Returned: { label: "Restitue", className: "bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-700" },
  Overdue: { label: "Retard", className: "bg-rose-500/10 text-rose-600 border-rose-500/20 animate-pulse" },
  Rejected: { label: "Refuse", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export const getLoanColumns = (): ColumnDef<any>[] => [
  {
    accessorKey: "item.work.title",
    header: "Ouvrage",
    cell: ({ row }) => {
      const title = row.original.item?.work?.title;
      const barcode = row.original.item?.barcode;

      return (
        <div className="flex flex-col py-1">
          <span className="text-sm font-black uppercase italic leading-tight tracking-tighter">{title}</span>
          <span className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] font-bold text-muted-foreground/60">
            <BookOpen className="h-3 w-3" /> {barcode}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "member.user.name",
    header: "Lecteur",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full border border-primary/10 bg-primary/5">
          <User className="h-3.5 w-3.5 text-primary/60" />
        </div>
        <span className="text-xs font-bold uppercase tracking-tight">{row.original.member?.user?.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "dueDate",
    header: "Echeance",
    cell: ({ row }) => {
      const date = row.original.dueDate;
      if (!date) return <span className="text-[10px] italic text-muted-foreground/40">Non fixee</span>;

      const isOverdue = new Date(date) < new Date() && row.original.status !== "Returned" && row.original.status !== "Rejected";

      return (
        <div
          className={cn(
            "flex items-center gap-2 text-[11px] font-black uppercase italic tracking-tighter",
            isOverdue ? "text-rose-600" : "text-muted-foreground",
          )}
        >
          <CalendarClock className="h-3.5 w-3.5" />
          {new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      const current = statusConfig[status] || { label: status, className: "" };

      return (
        <Badge className={cn("rounded-full border px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] shadow-none", current.className)}>
          {current.label}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const loan = row.original;
      const queryClient = useQueryClient();

      const validateMutation = useMutation({
        mutationFn: () => validateLoan(loan._id),
        onSuccess: (res: any) => {
          if (res.success) {
            toast.success("Pret valide avec succes");
            queryClient.invalidateQueries({ queryKey: ["loans"] });
          } else {
            toast.error(res.error || "Echec de validation");
          }
        },
      });

      const rejectMutation = useMutation({
        mutationFn: () => rejectLoan(loan._id),
        onSuccess: (res: any) => {
          if (res.success) {
            toast.success("Demande d'emprunt refusee");
            queryClient.invalidateQueries({ queryKey: ["loans"] });
          } else {
            toast.error(res.error || "Erreur lors du refus");
          }
        },
      });

      const returnMutation = useMutation({
        mutationFn: () => returnItem(loan._id),
        onSuccess: (res: any) => {
          if (res.success) {
            toast.success("Exemplaire reintegre au stock");
            queryClient.invalidateQueries({ queryKey: ["loans"] });
          } else {
            toast.error(res.error || "Erreur lors du retour");
          }
        },
      });

      const isLoading = validateMutation.isPending || rejectMutation.isPending || returnMutation.isPending;

      return (
        <div className="flex justify-end gap-2">
          {loan.status === "Pending" && (
            <>
              <Button
                size="sm"
                variant="outline"
                disabled={isLoading}
                onClick={() => rejectMutation.mutate()}
                className="h-9 rounded-xl border-destructive/30 px-4 text-[9px] font-black uppercase italic tracking-widest text-destructive transition-all hover:scale-105 hover:bg-destructive/10"
              >
                {rejectMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    <XCircle className="mr-1.5 h-3.5 w-3.5" />
                    Refuser
                  </>
                )}
              </Button>
              <Button
                size="sm"
                disabled={isLoading}
                onClick={() => validateMutation.mutate()}
                className="h-9 rounded-xl bg-primary px-4 text-[9px] font-black uppercase italic tracking-widest text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:bg-primary/90"
              >
                {validateMutation.isPending ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <>
                    <Check className="mr-1.5 h-3.5 w-3.5" />
                    Approuver
                  </>
                )}
              </Button>
            </>
          )}
          {(loan.status === "Active" || loan.status === "Overdue") && (
            <Button
              size="sm"
              variant="outline"
              disabled={isLoading}
              onClick={() => returnMutation.mutate()}
              className="h-9 rounded-xl border-emerald-500/30 px-4 text-[9px] font-black uppercase italic tracking-widest text-emerald-600 transition-all hover:scale-105 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
            >
              {returnMutation.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <>
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                  Cloturer
                </>
              )}
            </Button>
          )}
        </div>
      );
    },
  },
];
