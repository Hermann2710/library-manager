import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, User, Book as BookIcon, AlertCircle, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CancelReservationButton } from "./cancel-button";
import { cn } from "@/lib/utils";

/**
 * LoanCard Component.
 * Displays a summary of a loan or reservation. 
 * It dynamically calculates overdue status and adapts its visual theme accordingly.
 */
export function LoanCard({ loan }: { loan: any }) {
    const work = loan.item.work;
    const isPending = loan.status === "Pending";
    const isReturned = loan.status === "Returned";

    /**
     * Overdue Logic:
     * A loan is overdue if explicitly marked by the system OR if the 
     * due date has passed while the status is still 'Active'.
     */
    const isOverdue =
        loan.status === "Overdue" ||
        (new Date(loan.dueDate) < new Date() && loan.status === "Active");

    return (
        <Card className={cn(
            "group flex flex-col md:flex-row gap-5 p-4 items-center border-border/40 shadow-none overflow-hidden transition-all duration-300 rounded-[2rem]",
            isOverdue ? "bg-destructive/2 border-destructive/20" : "hover:bg-muted/30 hover:border-border/80 bg-card"
        )}>

            {/* COMPACT COVER IMAGE: Using standard <img> for guaranteed render stability */}
            <div className="relative h-28 w-20 shrink-0 bg-muted rounded-2xl overflow-hidden shadow-md border border-border/20">
                {work.coverImage ? (
                    <img
                        src={work.coverImage}
                        alt={work.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-muted/50">
                        <BookIcon className="h-8 w-8 opacity-10" />
                    </div>
                )}
            </div>

            {/* MAIN CONTENT: Title & Metadata */}
            <div className="flex flex-col flex-1 min-w-0 text-center md:text-left gap-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <h3 className="font-black text-sm md:text-base uppercase italic tracking-tight truncate max-w-62.5" title={work.title}>
                        {work.title}
                    </h3>

                    {/* STATUS BADGE: Color-coded based on the loan lifecycle */}
                    <Badge
                        variant="outline"
                        className={cn(
                            "text-[9px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full border-none shadow-sm",
                            isOverdue && "bg-destructive text-destructive-foreground animate-pulse",
                            isPending && "bg-amber-500/10 text-amber-600 border border-amber-500/20",
                            isReturned && "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20",
                            (loan.status === "Active" && !isOverdue) && "bg-primary text-primary-foreground"
                        )}
                    >
                        {isOverdue ? "Retard critique" : isPending ? "En attente" : isReturned ? "Rendu" : "En cours"}
                    </Badge>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground">
                    <div className="p-1 rounded-md bg-muted/50">
                        <User className="h-3 w-3" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wide truncate">
                        {work.authors.map((a: any) => a.name).join(", ")}
                    </span>
                </div>
            </div>

            {/* ACTIONS & DATES: Vertical separator on desktop */}
            <div className="flex flex-col items-center md:items-end gap-3 px-6 md:border-l border-dashed border-border/60 h-full justify-center min-w-45">
                <div className="flex flex-col items-center md:items-end">
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 mb-1.5">
                        {isPending ? "Expiration le" : isReturned ? "Retourné le" : "Date de retour"}
                    </p>

                    <div className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black tracking-tighter shadow-inner",
                        isOverdue ? "bg-destructive/10 text-destructive" : "bg-muted/50 text-foreground"
                    )}>
                        {isOverdue ? <AlertCircle className="h-3.5 w-3.5" /> : isReturned ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> : <Calendar className="h-3.5 w-3.5 text-primary" />}
                        {format(new Date(isReturned ? loan.returnDate : loan.dueDate), "dd MMM yyyy", { locale: fr })}
                    </div>
                </div>

                {/* Cancel Action: Restricted to pending reservations */}
                {isPending && (
                    <div className="w-full mt-1 animate-in slide-in-from-right-2 duration-500">
                        <CancelReservationButton loanId={loan._id} />
                    </div>
                )}
            </div>
        </Card>
    );
}