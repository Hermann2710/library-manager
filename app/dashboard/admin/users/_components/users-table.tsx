"use client";

import { deleteUserAccount, getAllUsers } from "@/actions/user-actions";
import { DataTable } from "@/components/shared/data-table";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, UserCog } from "lucide-react";
import { toast } from "sonner";
import { getUserColumns } from "./columns";

export function UsersTable() {
  const queryClient = useQueryClient();

  const { data = [], isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => getAllUsers(),
  });

  const { mutate: remove } = useMutation({
    mutationFn: deleteUserAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Compte supprime definitivement");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Impossible de supprimer le compte");
    },
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className={cn(
        "relative overflow-hidden rounded-lg border border-border/40 bg-card/50 p-1 shadow-xl shadow-black/5 backdrop-blur-sm",
        isLoading && "opacity-60"
      )}>
        <DataTable
          columns={getUserColumns((id) => remove(id))}
          data={data}
          loading={isLoading}
        />

        {isLoading && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-lg bg-background/20 backdrop-blur-[2px]">
            <div className="rounded-lg border border-border/20 bg-background p-4 shadow-lg">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground">
                Securisation
              </p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                Chargement de la base utilisateurs...
              </p>
            </div>
          </div>
        )}
      </div>

      {!isLoading && (
        <div className="flex items-center gap-4 rounded-lg border border-dashed border-border/60 bg-muted/20 p-6">
          <div className="rounded-lg border border-border/10 bg-background p-3 shadow-sm">
            <UserCog className="h-5 w-5 text-muted-foreground/60" />
          </div>
          <div className="space-y-0.5">
            <h4 className="text-[10px] font-black uppercase tracking-widest">Controle de securite</h4>
            <p className="text-[10px] font-medium text-muted-foreground">
              Chaque modification de role ou suppression est enregistree dans l'audit systeme.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
