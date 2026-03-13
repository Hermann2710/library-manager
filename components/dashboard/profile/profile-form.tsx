"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Save, X } from "lucide-react";
import { ImageUpload } from "@/components/shared/image-upload";
import { updateProfile } from "@/actions/user-actions";
import { useSession } from "next-auth/react"; // Import pour l'actualisation

const profileSchema = z.object({
    name: z.string().min(2, "Le nom est trop court"),
    email: z.string().email("Email invalide"),
    image: z.string().optional(),
});

export function ProfileForm({ user }: { user: any }) {
    const { update } = useSession(); // Hook pour mettre à jour la session
    const [isEditing, setIsEditing] = useState(false);

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema as any),
        defaultValues: {
            name: user.name || "",
            email: user.email || "",
            image: user.image || "",
        },
    });

    const currentImage = form.watch("image");

    async function onSubmit(values: z.infer<typeof profileSchema>) {
        try {
            const res = await updateProfile(values);

            if (res.success) {
                // MISE À JOUR DU TOKEN NEXT-AUTH
                // On passe les nouvelles valeurs pour rafraîchir le cookie/session
                await update({
                    ...user,
                    name: values.name,
                    email: values.email,
                    image: values.image,
                });

                toast.success("Profil et session synchronisés");
                setIsEditing(false);
            }
        } catch (error: any) {
            toast.error(error.message);
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-card border rounded-[2.5rem] p-8 flex flex-col items-center text-center space-y-6 shadow-sm">
                    <ImageUpload
                        value={currentImage}
                        onChange={(url) => form.setValue("image", url, { shouldDirty: true })}
                        onRemove={() => form.setValue("image", "", { shouldDirty: true })}
                        className={!isEditing ? "pointer-events-none opacity-90" : ""}
                    />
                    <div>
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter">
                            {form.watch("name") || user.name}
                        </h2>
                        <span className="inline-block mt-2 px-4 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20">
                            {user.role}
                        </span>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-2">
                <form onSubmit={form.handleSubmit(onSubmit)} className="bg-card border rounded-[2.5rem] p-8 shadow-sm space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-black uppercase italic flex items-center gap-2">
                            Paramètres du compte
                        </h3>
                        {!isEditing ? (
                            <Button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                variant="outline"
                                className="rounded-full font-black uppercase text-[10px] tracking-widest italic"
                            >
                                Modifier le profil
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    onClick={() => {
                                        form.reset();
                                        setIsEditing(false);
                                    }}
                                    variant="ghost"
                                    className="rounded-full font-black uppercase text-[10px] tracking-widest"
                                >
                                    <X className="h-4 w-4 mr-1" /> Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={form.formState.isSubmitting || !form.formState.isDirty}
                                    className="rounded-full font-black uppercase text-[10px] tracking-widest italic px-6"
                                >
                                    {form.formState.isSubmitting ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Enregistrer
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Nom complet</label>
                            <Input
                                {...form.register("name")}
                                disabled={!isEditing}
                                className="bg-muted/20 border-none h-12 rounded-2xl font-bold focus-visible:ring-1 focus-visible:ring-primary"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Adresse Email</label>
                            <Input
                                {...form.register("email")}
                                disabled={!isEditing}
                                className="bg-muted/20 border-none h-12 rounded-2xl font-bold focus-visible:ring-1 focus-visible:ring-primary"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-dashed">
                        <div className="flex items-center justify-between p-4 bg-muted/10 rounded-2xl border border-muted/20">
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-black uppercase tracking-widest">Token de sécurité</p>
                                <p className="text-xs font-mono text-muted-foreground truncate max-w-50 sm:max-w-none italic">
                                    {user.id}
                                </p>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}