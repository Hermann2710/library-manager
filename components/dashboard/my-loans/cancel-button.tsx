"use client"

import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { cancelReservation } from "@/actions/loan-actions";
import { toast } from "sonner";
import { X, Loader2, AlertCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * CancelReservationButton Component.
 * Provides a secure, two-step confirmation process for cancelling a pending loan.
 * It uses an AlertDialog to prevent accidental data loss or state changes.
 */
export function CancelReservationButton({ loanId }: { loanId: string }) {
    // Tracking the async state to disable the button and show a loader during the process
    const [isPending, setIsPending] = useState(false);

    /**
     * handleCancel:
     * Triggers the Server Action to delete or update the loan status.
     * Re-renders are handled by Next.js's router.refresh() if called in the action.
     */
    const handleCancel = async () => {
        setIsPending(true);
        try {
            const res = await cancelReservation(loanId);

            if (res?.error) {
                toast.error(res.error);
                setIsPending(false); // Reset state only on error to allow user to retry
            } else {
                toast.success("Réservation annulée avec succès.");
                // Note: We don't necessarily reset isPending on success because the 
                // component will likely be unmounted as the list refreshes.
            }
        } catch (error) {
            toast.error("Une erreur est survenue lors de l'annulation.");
            setIsPending(false);
        }
    };

    return (
        <AlertDialog>
            {/* TRIGGER: A subtle ghost button that turns destructive on hover */}
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    disabled={isPending}
                    className={cn(
                        "text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 h-9 px-4 rounded-xl",
                        "font-black text-[10px] uppercase tracking-[0.15em] transition-all duration-300 active:scale-95"
                    )}
                >
                    {isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-2" />
                    ) : (
                        <X className="h-3.5 w-3.5 mr-2" />
                    )}
                    Annuler la réservation
                </Button>
            </AlertDialogTrigger>

            {/* MODAL CONTENT: High-contrast destructive design */}
            <AlertDialogContent className="max-w-100 rounded-[2.5rem] border-border/40 p-8 shadow-2xl animate-in zoom-in-95 duration-300">
                <AlertDialogHeader className="space-y-4">
                    <div className="mx-auto bg-destructive/10 p-4 rounded-full w-fit border border-destructive/20 shadow-sm">
                        <AlertCircle className="h-8 w-8 text-destructive" />
                    </div>

                    <div className="space-y-2 text-center">
                        <AlertDialogTitle className="font-black uppercase italic text-xl tracking-tighter">
                            Annuler cette réservation ?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm font-medium text-muted-foreground leading-relaxed px-2">
                            Cette action est irréversible. L'ouvrage sera immédiatement remis en circulation pour les autres lecteurs.
                        </AlertDialogDescription>
                    </div>
                </AlertDialogHeader>

                <AlertDialogFooter className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-2">
                    <AlertDialogCancel className="flex-1 rounded-2xl font-black uppercase text-[10px] tracking-widest h-12 border-muted-foreground/20 hover:bg-muted transition-all">
                        Conserver
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault(); // Prevent modal from closing instantly
                            handleCancel();
                        }}
                        className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-2xl font-black uppercase text-[10px] tracking-widest h-12 shadow-lg shadow-destructive/20 transition-all active:scale-95"
                    >
                        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmer l'annulation"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}