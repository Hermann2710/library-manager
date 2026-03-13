import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, User, Book as BookIcon } from "lucide-react";
import Image from "next/image";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CancelReservationButton } from "./cancel-button";

export function LoanCard({ loan }: { loan: any }) {
    const work = loan.item.work;
    const isPending = loan.status === "Pending";

    // Calcul de retard : soit le statut est explicitement Overdue, 
    // soit la date d'échéance est passée alors que le prêt est encore Active
    const isOverdue =
        loan.status === "Overdue" ||
        (new Date(loan.dueDate) < new Date() && loan.status === "Active");

    return (
        <Card className="flex flex-col md:flex-row gap-4 p-3 items-center border-muted/60 shadow-none overflow-hidden hover:bg-muted/10 transition-colors">
            {/* Image Mini */}
            <div className="relative h-24 w-16 shrink-0 bg-muted rounded-md overflow-hidden shadow-sm">
                {work.coverImage ? (
                    <Image
                        src={work.coverImage}
                        alt={work.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <BookIcon className="h-6 w-6 opacity-20" />
                    </div>
                )}
            </div>

            {/* Infos Principales */}
            <div className="flex flex-col flex-1 min-w-0 text-center md:text-left gap-1">
                <div className="flex items-center justify-center md:justify-start gap-2">
                    <h3 className="font-bold text-sm truncate" title={work.title}>
                        {work.title}
                    </h3>
                    <Badge
                        variant={isOverdue ? "destructive" : isPending ? "secondary" : "outline"}
                        className="text-[9px] h-4 uppercase font-bold"
                    >
                        {isOverdue ? "Retard" : loan.status}
                    </Badge>
                </div>

                <div className="flex items-center justify-center md:justify-start gap-1 text-muted-foreground text-xs">
                    <User className="h-3 w-3" />
                    <span className="truncate">
                        {work.authors.map((a: any) => a.name).join(", ")}
                    </span>
                </div>
            </div>

            {/* Section Actions & Dates */}
            <div className="flex flex-col items-center md:items-end gap-2 px-4 md:border-l border-muted-foreground/10 h-full justify-center min-w-40">
                <div className="flex flex-col items-center md:items-end">
                    <p className="text-[10px] uppercase font-bold text-muted-foreground/60 leading-none mb-1">
                        {isPending ? "À retirer avant le" : "Retour prévu"}
                    </p>
                    <div className="flex items-center gap-1.5 text-sm font-black text-foreground">
                        <Calendar className={`h-3.5 w-3.5 ${isOverdue ? "text-destructive" : "text-primary"}`} />
                        {/* Pour le pending, on affiche la dueDate (limite de retrait) 
                            Pour l'active, la date de retour prévue */}
                        {format(new Date(loan.dueDate), "dd MMM yyyy", { locale: fr })}
                    </div>
                </div>

                {/* Bouton d'annulation uniquement pour les réservations non validées */}
                {isPending && (
                    <div className="mt-1">
                        <CancelReservationButton loanId={loan._id} />
                    </div>
                )}
            </div>
        </Card>
    );
}