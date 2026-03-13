"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { reserveItem } from "@/actions/loan-actions";
import { toast } from "sonner";
import { BookmarkPlus, Loader2, CheckCircle2 } from "lucide-react";

export function ReserveButton({ itemId, title }: { itemId: string; title: string }) {
    const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

    const handleReserve = async (e: React.MouseEvent) => {
        // Empêche de déclencher l'ouverture de la modal de détails si le bouton est dans la Card
        e.stopPropagation();

        if (status !== "idle") return;

        setStatus("loading");
        try {
            const res = await reserveItem(itemId);

            if (res?.error) {
                toast.error(res.error);
                setStatus("idle");
            } else {
                toast.success(`Réservé : ${title}`);
                setStatus("success");
            }
        } catch (error) {
            toast.error("Erreur lors de la réservation");
            setStatus("idle");
        }
    };

    return (
        <Button
            onClick={handleReserve}
            disabled={status !== "idle"}
            variant={status === "success" ? "secondary" : "outline"}
            size="sm"
            className={`w-full gap-2 transition-all duration-300 ${status === "success"
                ? "bg-green-50 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-600"
                : "border-primary text-primary hover:bg-primary hover:text-white"
                }`}
        >
            {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}

            {status === "idle" && (
                <>
                    <BookmarkPlus className="h-4 w-4" />
                    <span>Réserver</span>
                </>
            )}

            {status === "success" && (
                <>
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Réservé !</span>
                </>
            )}
        </Button>
    );
}