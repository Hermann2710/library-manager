import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Save, X } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { ProfileFormValues, ProfileUser } from "./profile-types";

type IdentityTabProps = {
  form: UseFormReturn<ProfileFormValues>;
  isEditing: boolean;
  onCancel: () => void;
  onEdit: () => void;
  onSubmit: (values: ProfileFormValues) => void;
  user: ProfileUser;
};

export function IdentityTab({ form, isEditing, onCancel, onEdit, onSubmit, user }: IdentityTabProps) {
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-lg border bg-card p-5 shadow-sm md:p-6">
      <div className="mb-6 flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-black uppercase tracking-tight">Parametres du compte</h3>
          <p className="text-sm text-muted-foreground">Informations visibles dans la session et le dashboard.</p>
        </div>
        {!isEditing ? (
          <Button type="button" variant="outline" onClick={onEdit}>Modifier</Button>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="ghost" onClick={onCancel}>
              <X className="mr-2 h-4 w-4" /> Annuler
            </Button>
            <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isDirty}>
              {form.formState.isSubmitting
                ? <Loader2 className="h-4 w-4 animate-spin" />
                : <><Save className="mr-2 h-4 w-4" /> Enregistrer</>}
            </Button>
          </div>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Nom complet</label>
          <Input {...form.register("name")} disabled={!isEditing} className="h-12" />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Adresse email</label>
          <Input {...form.register("email")} disabled={!isEditing} className="h-12" />
        </div>
      </div>

      <div className="mt-6 rounded-lg border bg-muted/20 p-4">
        <p className="text-[10px] font-black uppercase tracking-widest text-primary">Identifiant securite</p>
        <p className="mt-1 break-all font-mono text-xs text-muted-foreground">{user.id}</p>
      </div>
    </form>
  );
}
