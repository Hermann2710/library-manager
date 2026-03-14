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
import { useSession } from "next-auth/react";

/**
 * Profile Schema:
 * Validates user input before sending it to the server.
 * Ensures data integrity and provides immediate feedback to the user.
 */
const profileSchema = z.object({
    name: z.string().min(2, "Le nom est trop court"),
    email: z.string().email("Email invalide"),
    image: z.string().optional(),
});

export function ProfileForm({ user }: { user: any }) {
    // The 'update' function from useSession is key to refreshing the client-side 
    // cookie without requiring a full page reload.
    const { update } = useSession();
    const [isEditing, setIsEditing] = useState(false);

    // Initializing the form with current user data from the session
    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema as any),
        defaultValues: {
            name: user.name || "",
            email: user.email || "",
            image: user.image || "",
        },
    });

    // Real-time tracking of the image field for instant preview
    const currentImage = form.watch("image");

    /**
     * onSubmit:
     * 1. Persists data to the MongoDB database via a Server Action.
     * 2. Synchronizes the NextAuth session so the UI (navbar, sidebar) updates instantly.
     */
    async function onSubmit(values: z.infer<typeof profileSchema>) {
        try {
            const res = await updateProfile(values);

            if (res.success) {
                // Updating the NextAuth session to reflect changes globally in the app
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
            toast.error(error.message || "Une erreur est survenue");
        }
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* LEFT COLUMN: Visual Identity Card */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-card border-border/40 border rounded-[2.5rem] p-8 flex flex-col items-center text-center space-y-6 shadow-sm backdrop-blur-sm transition-all hover:shadow-md">
                    <ImageUpload
                        value={currentImage}
                        onChange={(url) => form.setValue("image", url, { shouldDirty: true })}
                        onRemove={() => form.setValue("image", "", { shouldDirty: true })}
                        className={!isEditing ? "pointer-events-none opacity-90" : "animate-pulse"}
                    />
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter text-foreground">
                            {form.watch("name") || user.name}
                        </h2>
                        <span className="inline-block px-5 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/20 shadow-sm">
                            Statut : {user.role}
                        </span>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: Account Settings Form */}
            <div className="lg:col-span-2">
                <form onSubmit={form.handleSubmit(onSubmit)} className="bg-card border-border/40 border rounded-[2.5rem] p-8 shadow-sm space-y-8 relative overflow-hidden">

                    {/* Header with toggle-able edit actions */}
                    <div className="flex items-center justify-between border-b border-dashed border-border/60 pb-6">
                        <h3 className="text-lg font-black uppercase italic tracking-tight flex items-center gap-2">
                            Paramètres du compte
                        </h3>
                        {!isEditing ? (
                            <Button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                variant="outline"
                                className="rounded-xl font-black uppercase text-[10px] tracking-widest italic h-10 px-6 hover:bg-primary/5 transition-all"
                            >
                                Modifier le profil
                            </Button>
                        ) : (
                            <div className="flex gap-3 animate-in fade-in zoom-in-95 duration-300">
                                <Button
                                    type="button"
                                    onClick={() => {
                                        form.reset();
                                        setIsEditing(false);
                                    }}
                                    variant="ghost"
                                    className="rounded-xl font-black uppercase text-[10px] tracking-widest h-10"
                                >
                                    <X className="h-4 w-4 mr-2" /> Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={form.formState.isSubmitting || !form.formState.isDirty}
                                    className="rounded-xl font-black uppercase text-[10px] tracking-widest italic px-8 h-10 shadow-lg shadow-primary/20 transition-all active:scale-95"
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

                    {/* Form Fields: Using a clean, focus-oriented design */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/70 ml-1">
                                Nom complet
                            </label>
                            <Input
                                {...form.register("name")}
                                disabled={!isEditing}
                                className="bg-muted/30 border-none h-14 rounded-2xl font-bold text-sm focus-visible:ring-2 focus-visible:ring-primary/20 transition-all disabled:opacity-50"
                            />
                        </div>
                        <div className="space-y-2.5">
                            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground/70 ml-1">
                                Adresse Email
                            </label>
                            <Input
                                {...form.register("email")}
                                disabled={!isEditing}
                                className="bg-muted/30 border-none h-14 rounded-2xl font-bold text-sm focus-visible:ring-2 focus-visible:ring-primary/20 transition-all disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {/* Security Metadata: Non-editable information for user awareness */}
                    <div className="pt-8 mt-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-6 bg-muted/20 rounded-[2rem] border border-muted/30 gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary/70">Identifiant de sécurité</p>
                                <p className="text-[11px] font-mono text-muted-foreground/80 break-all bg-background/50 px-3 py-1 rounded-lg">
                                    {user.id}
                                </p>
                            </div>
                            <div className="flex -space-x-2">
                                {/* Decorative elements to make the footer feel less empty */}
                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}