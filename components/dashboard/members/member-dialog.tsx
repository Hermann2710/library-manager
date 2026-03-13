"use client"

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memberSchema } from "@/lib/validation/member";
import { updateMember } from "@/actions/member-actions";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function MemberDialog({ isOpen, onOpenChange, member }: any) {
    const queryClient = useQueryClient();

    const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
        resolver: zodResolver(memberSchema as any),
        defaultValues: {
            phone: "",
            address: "",
            status: "Active",
            membershipExpiresAt: ""
        }
    });

    useEffect(() => {
        if (member) {
            reset({
                ...member,
                user: member.user?._id || member.user,
                // On formate la date pour l'input type="date"
                membershipExpiresAt: member.membershipExpiresAt ? new Date(member.membershipExpiresAt).toISOString().split('T')[0] : ""
            });
        }
    }, [member, reset, isOpen]);

    const { mutate, isPending } = useMutation({
        mutationFn: (data: any) => updateMember(member._id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["members"] });
            toast.success("Fiche membre mise à jour");
            onOpenChange(false);
        },
        onError: (err: any) => toast.error(err.message)
    });

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Modifier le membre : {member?.user?.name}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit((d) => mutate(d))} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Téléphone</Label>
                        <Input {...register("phone")} placeholder="06 00 00 00 00" />
                        {errors.phone && <p className="text-xs text-destructive">{errors.phone.message as string}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label>Adresse (Optionnel)</Label>
                        <Input {...register("address")} placeholder="123 rue de la Paix" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Statut</Label>
                            <Controller
                                control={control}
                                name="status"
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent position="popper" sideOffset={4}>
                                            <SelectItem value="Active">Actif</SelectItem>
                                            <SelectItem value="Inactive">Inactif</SelectItem>
                                            <SelectItem value="Banned">Banni</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Date d'expiration</Label>
                            <Input type="date" {...register("membershipExpiresAt")} />
                        </div>
                    </div>

                    <DialogFooter className="pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Annuler</Button>
                        <Button type="submit" disabled={isPending}>Enregistrer les modifications</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}