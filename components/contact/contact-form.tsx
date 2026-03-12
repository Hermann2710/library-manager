'use client';

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, ContactInput } from "@/lib/validation/contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function ContactForm() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ContactInput>({
        resolver: zodResolver(contactSchema as any),
    });

    const onSubmit = async (data: ContactInput) => {
        try {
            // Simulation d'un appel API ou Server Action
            console.log("Data envoyée:", data);
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast.success("Message envoyé avec succès !");
            reset();
        } catch (error) {
            toast.error("Une erreur est survenue.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 p-8 border rounded-2xl bg-card shadow-sm">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input id="firstName" placeholder="Jean" {...register("firstName")} disabled={isSubmitting} />
                    {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input id="lastName" placeholder="Dupont" {...register("lastName")} disabled={isSubmitting} />
                    {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="jean@example.com" {...register("email")} disabled={isSubmitting} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                    id="message"
                    placeholder="Comment pouvons-nous vous aider ?"
                    className="min-h-37.5"
                    {...register("message")}
                    disabled={isSubmitting}
                />
                {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
            </div>

            <Button type="submit" className="w-full h-11" disabled={isSubmitting}>
                {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
            </Button>
        </form>
    );
}