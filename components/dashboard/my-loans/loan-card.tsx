import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertCircle, Book as BookIcon, Calendar, CheckCircle2, XCircle, User } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CancelReservationButton } from "./cancel-button";

export function LoanCard({ loan }: { loan: any }) {
  const work = loan.item.work;
  const isPending = loan.status === "Pending";
  const isReturned = loan.status === "Returned";
  const isRejected = loan.status === "Rejected";
  const isOverdue = loan.status === "Overdue" || (new Date(loan.dueDate) < new Date() && loan.status === "Active");
  const displayDate = isReturned ? loan.returnDate : isRejected ? loan.updatedAt : loan.dueDate;

  return (
    <Card
      className={cn(
        "group flex flex-col items-center gap-5 overflow-hidden rounded-[2rem] border-border/40 p-4 shadow-none transition-all duration-300 md:flex-row",
        isOverdue ? "border-destructive/20 bg-destructive/2" : "bg-card hover:border-border/80 hover:bg-muted/30",
      )}
    >
      <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-2xl border border-border/20 bg-muted shadow-md">
        {work.coverImage ? (
          <img
            src={work.coverImage}
            alt={work.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted/50">
            <BookIcon className="h-8 w-8 opacity-10" />
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-2 text-center md:text-left">
        <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
          <h3 className="max-w-62.5 truncate text-sm font-black uppercase italic tracking-tight md:text-base" title={work.title}>
            {work.title}
          </h3>

          <Badge
            variant="outline"
            className={cn(
              "rounded-full border-none px-3 py-0.5 text-[9px] font-black uppercase tracking-widest shadow-sm",
              isOverdue && "bg-destructive text-destructive-foreground animate-pulse",
              isPending && "border border-amber-500/20 bg-amber-500/10 text-amber-600",
              isRejected && "border border-destructive/20 bg-destructive/10 text-destructive",
              isReturned && "border border-emerald-500/20 bg-emerald-500/10 text-emerald-600",
              loan.status === "Active" && !isOverdue && "bg-primary text-primary-foreground",
            )}
          >
            {isOverdue ? "Retard critique" : isPending ? "En attente" : isRejected ? "Refuse" : isReturned ? "Rendu" : "En cours"}
          </Badge>
        </div>

        <div className="flex items-center justify-center gap-2 text-muted-foreground md:justify-start">
          <div className="rounded-md bg-muted/50 p-1">
            <User className="h-3 w-3" />
          </div>
          <span className="truncate text-[11px] font-bold uppercase tracking-wide">
            {work.authors.map((author: any) => author.name).join(", ")}
          </span>
        </div>
      </div>

      <div className="flex h-full min-w-45 flex-col items-center justify-center gap-3 px-6 md:items-end md:border-l md:border-dashed md:border-border/60">
        <div className="flex flex-col items-center md:items-end">
          <p className="mb-1.5 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
            {isPending ? "Expiration le" : isRejected ? "Refuse le" : isReturned ? "Retourne le" : "Date de retour"}
          </p>

          <div
            className={cn(
              "flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black tracking-tighter shadow-inner",
              isOverdue ? "bg-destructive/10 text-destructive" : "bg-muted/50 text-foreground",
            )}
          >
            {isOverdue ? (
              <AlertCircle className="h-3.5 w-3.5" />
            ) : isRejected ? (
              <XCircle className="h-3.5 w-3.5 text-destructive" />
            ) : isReturned ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            ) : (
              <Calendar className="h-3.5 w-3.5 text-primary" />
            )}
            {format(new Date(displayDate), "dd MMM yyyy", { locale: fr })}
          </div>
        </div>

        {isPending && (
          <div className="mt-1 w-full animate-in slide-in-from-right-2 duration-500">
            <CancelReservationButton loanId={loan._id} />
          </div>
        )}
      </div>
    </Card>
  );
}
