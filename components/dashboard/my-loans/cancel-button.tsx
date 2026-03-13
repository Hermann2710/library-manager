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
import { X, Loader2, AlertCircle } from "lucide-react";

export function CancelReservationButton({ loanId }: { loanId: string }) {
    const [isPending, setIsPending] = useState(false);

    const handleCancel = async () => {
        setIsPending(true);
        try {
            const res = await cancelReservation(loanId);
            if (res?.error) {
                toast.error(res.error);
                setIsPending(false);
            } else {
                toast.success("Réservation annulée avec succès.");
            }
        } catch (error) {
            toast.error("Une erreur est survenue lors de l'annulation.");
            setIsPending(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    disabled={isPending}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 h-8 gap-1.5 font-bold text-[11px] uppercase tracking-wider transition-colors"
                >
                    {isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                        <X className="h-3 w-3" />
                    )}
                    Annuler
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="max-w-100 rounded-2xl">
                <AlertDialogHeader>
                    <div className="flex items-center gap-2 text-destructive mb-2">
                        <AlertCircle className="h-5 w-5" />
                        <AlertDialogTitle className="font-black">Annuler la réservation ?</AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-sm">
                        Cette action est irréversible. L'exemplaire sera immédiatement remis en rayon et redeviendra disponible pour les autres membres.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-4">
                    <AlertDialogCancel className="rounded-xl font-bold">Conserver</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={handleCancel}
                        className="bg-destructive hover:bg-destructive/90 rounded-xl font-bold"
                    >
                        Confirmer l'annulation
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}