"use client"

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memberSchema } from "@/lib/validation/member";
import { updateMember } from "@/actions/member-actions";
import { toast } from "sonner";
import { Phone, MapPin, UserCheck, CalendarDays, Loader2, ShieldAlert } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

/**
 * MemberDialog Component:
 * Handles administrative updates for a specific member profile.
 * Synchronizes personal contact info and subscription metadata.
 */
export function MemberDialog({ isOpen, onOpenChange, member }: any) {
    const queryClient = useQueryClient();

    // Form setup with schema validation for membership integrity
    const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
        resolver: zodResolver(memberSchema as any),
        defaultValues: {
            phone: "",
            address: "",
            status: "Active",
            membershipExpiresAt: ""
        }
    });

    /**
     * Data Hydration:
     * Transforms the database member object into flat form values.
     * Specific handling for the date picker format (YYYY-MM-DD).
     */
    useEffect(() => {
        if (member && isOpen) {
            reset({
                ...member,
                user: member.user?._id || member.user,
                membershipExpiresAt: member.membershipExpiresAt
                    ? new Date(member.membershipExpiresAt).toISOString().split('T')[0]
                    : ""
            });
        }
    }, [member, reset, isOpen]);

    // Mutation for persistence with cache invalidation
    const { mutate, isPending } = useMutation({
        mutationFn: (data: any) => updateMember(member._id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["members"] });
            toast.success("Registre mis à jour : Profil membre synchronisé");
            onOpenChange(false);
        },
        onError: (err: any) => toast.error(err.message || "Erreur lors de la mise à jour")
    });

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg rounded-[3rem] border-border/40 p-8 shadow-2xl">
                <DialogHeader className="flex flex-row items-center gap-4 mb-6">
                    <div className="bg-primary/10 p-3 rounded-2xl border border-primary/20">
                        <UserCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <DialogTitle className="text-xl font-black uppercase italic tracking-tighter">
                            Fiche Lecteur : {member?.user?.name || "Membre"}
                        </DialogTitle>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                            ID : {member?._id?.slice(-8).toUpperCase()}
                        </p>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-6">

                    {/* SECTION: Contact Details */}
                    <div className="space-y-4 p-6 bg-muted/20 rounded-[2rem] border border-border/40 relative overflow-hidden">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                                <Phone className="h-3 w-3" /> Téléphone
                            </Label>
                            <Input
                                {...register("phone")}
                                placeholder="06 00 00 00 00"
                                className="rounded-xl h-11 bg-background/50 border-border/60"
                            />
                            {errors.phone && <p className="text-[10px] font-bold text-destructive italic px-1">{errors.phone.message as string}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                                <MapPin className="h-3 w-3" /> Adresse physique (Optionnel)
                            </Label>
                            <Input
                                {...register("address")}
                                placeholder="123 rue de la Paix..."
                                className="rounded-xl h-11 bg-background/50 border-border/60"
                            />
                        </div>
                    </div>

                    {/* SECTION: Membership Logic */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                                <ShieldAlert className="h-3 w-3" /> Statut Adhésion
                            </Label>
                            <Controller
                                control={control}
                                name="status"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="rounded-xl h-11 border-border/60">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-border/40 shadow-xl">
                                            <SelectItem value="Active" className="text-xs font-bold italic text-emerald-600">Actif</SelectItem>
                                            <SelectItem value="Inactive" className="text-xs font-bold italic text-slate-500">Inactif</SelectItem>
                                            <SelectItem value="Banned" className="text-xs font-bold italic text-rose-600">Banni</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
                                <CalendarDays className="h-3 w-3" /> Expiration
                            </Label>
                            <Input
                                type="date"
                                {...register("membershipExpiresAt")}
                                className="rounded-xl h-11 border-border/60"
                            />
                        </div>
                    </div>

                    <DialogFooter className="pt-6 gap-3">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="rounded-xl font-bold uppercase text-[10px] tracking-widest"
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="rounded-2xl h-12 px-8 font-black uppercase text-[10px] tracking-[0.2em] italic shadow-lg shadow-primary/20 min-w-50"
                        >
                            {isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                "Mettre à jour le profil"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}