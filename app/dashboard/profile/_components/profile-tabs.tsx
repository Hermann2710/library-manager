"use client";

import { updateProfile } from "@/actions/user-actions";
import { ImageUpload } from "@/components/shared/image-upload";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ProfileData } from "../_actions/get-profile-data";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { Activity, CalendarClock, IdCard, Loader2, Palette, Save, ShieldCheck, UserRound, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

type ProfileUser = {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
};

const profileSchema = z.object({
    name: z.string().min(2, "Le nom est trop court"),
    email: z.string().email("Email invalide"),
    image: z.string().optional(),
});

function formatDate(value?: string) {
    if (!value) return "Non renseigne";
    return new Intl.DateTimeFormat("fr-CM", { dateStyle: "medium" }).format(new Date(value));
}

function StatCard({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-lg border bg-background p-4">
            <p className="text-2xl font-black">{value}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
        </div>
    );
}

export function ProfileTabs({ user, profileData }: { user: ProfileUser; profileData: ProfileData }) {
    const { update } = useSession();
    const [isEditing, setIsEditing] = useState(false);

    const form = useForm<z.infer<typeof profileSchema>>({
        resolver: zodResolver(profileSchema),
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
                await update({ ...user, ...values });
                toast.success("Profil et session synchronises");
                setIsEditing(false);
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
        }
    }

    return (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            <Card className="h-fit rounded-lg">
                <CardContent className="flex flex-col items-center gap-5 p-6 text-center">
                    <ImageUpload
                        value={currentImage}
                        onChange={(url) => form.setValue("image", url, { shouldDirty: true })}
                        onRemove={() => form.setValue("image", "", { shouldDirty: true })}
                        className={!isEditing ? "pointer-events-none opacity-90" : ""}
                    />
                    <div className="w-full space-y-2">
                        <h2 className="break-words text-2xl font-black uppercase tracking-tight">
                            {form.watch("name") || user.name || "Utilisateur"}
                        </h2>
                        <Badge variant="secondary" className="rounded-md uppercase">
                            {user.role || "reader"}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="identity" className="min-w-0">
                <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-lg bg-muted/40 p-1 sm:grid-cols-4">
                    <TabsTrigger value="identity" className="rounded-md gap-2">
                        <UserRound className="h-4 w-4" /> Identite
                    </TabsTrigger>
                    <TabsTrigger value="member" className="rounded-md gap-2">
                        <IdCard className="h-4 w-4" /> Membre
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="rounded-md gap-2">
                        <Activity className="h-4 w-4" /> Activite
                    </TabsTrigger>
                    <TabsTrigger value="preferences" className="rounded-md gap-2">
                        <Palette className="h-4 w-4" /> Preferences
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="identity" className="mt-6">
                    <form onSubmit={form.handleSubmit(onSubmit)} className="rounded-lg border bg-card p-5 shadow-sm md:p-6">
                        <div className="mb-6 flex flex-col gap-3 border-b pb-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h3 className="font-black uppercase tracking-tight">Parametres du compte</h3>
                                <p className="text-sm text-muted-foreground">Informations visibles dans la session et le dashboard.</p>
                            </div>
                            {!isEditing ? (
                                <Button type="button" variant="outline" onClick={() => setIsEditing(true)}>
                                    Modifier
                                </Button>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => {
                                            form.reset();
                                            setIsEditing(false);
                                        }}
                                    >
                                        <X className="mr-2 h-4 w-4" /> Annuler
                                    </Button>
                                    <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isDirty}>
                                        {form.formState.isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Save className="mr-2 h-4 w-4" /> Enregistrer</>}
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
                </TabsContent>

                <TabsContent value="member" className="mt-6">
                    <Card className="rounded-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <ShieldCheck className="h-5 w-5 text-primary" /> Fiche membre
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            {profileData.member ? (
                                <>
                                    <Info label="Code membre" value={profileData.member.memberId} />
                                    <Info label="Statut" value={profileData.member.status} />
                                    <Info label="Telephone" value={profileData.member.phone} />
                                    <Info label="Adresse" value={profileData.member.address || "Non renseignee"} />
                                    <Info label="Inscrit le" value={formatDate(profileData.member.createdAt)} />
                                    <Info label="Expiration" value={formatDate(profileData.member.membershipExpiresAt)} />
                                </>
                            ) : (
                                <p className="col-span-full text-sm text-muted-foreground">Aucune fiche membre n'est encore liee a ce compte.</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="activity" className="mt-6 space-y-5">
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                        <StatCard label="Actifs" value={profileData.stats.activeLoans} />
                        <StatCard label="A valider" value={profileData.stats.pendingLoans} />
                        <StatCard label="En retard" value={profileData.stats.overdueLoans} />
                        <StatCard label="Retournes" value={profileData.stats.returnedLoans} />
                    </div>

                    <Card className="rounded-lg">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg">
                                <CalendarClock className="h-5 w-5 text-primary" /> Derniers mouvements
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {profileData.recentLoans.length > 0 ? profileData.recentLoans.map((loan) => (
                                <div key={loan.id} className="flex flex-col gap-1 rounded-lg border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <p className="font-bold">{loan.title}</p>
                                        <p className="text-xs text-muted-foreground">Retour prevu : {formatDate(loan.dueDate)}</p>
                                    </div>
                                    <Badge variant="outline" className="w-fit rounded-md">{loan.status}</Badge>
                                </div>
                            )) : (
                                <p className="text-sm text-muted-foreground">Aucun mouvement recent.</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="preferences" className="mt-6">
                    <Card className="rounded-lg">
                        <CardHeader>
                            <CardTitle className="text-lg">Apparence</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="font-bold">Theme de l'application</p>
                                <p className="text-sm text-muted-foreground">Choisissez le mode clair, sombre ou systeme.</p>
                            </div>
                            <ThemeToggle showLabel />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function Info({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-lg border bg-background p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</p>
            <p className="mt-1 break-words font-semibold">{value}</p>
        </div>
    );
}
