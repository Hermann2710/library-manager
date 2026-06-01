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
            console.log("Data envoyee:", data);
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast.success("Message envoye avec succes !");
            reset();
        } catch {
            toast.error("Une erreur est survenue.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 rounded-lg border bg-card p-8 shadow-sm">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="firstName">Prenom</Label>
                    <Input id="firstName" placeholder="Hermann" {...register("firstName")} disabled={isSubmitting} />
                    {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input id="lastName" placeholder="Douanla" {...register("lastName")} disabled={isSubmitting} />
                    {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="contact@votrelibrairie.cm" {...register("email")} disabled={isSubmitting} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                    id="message"
                    placeholder="Ex: Nous voulons gerer notre stock, les prets et les membres de notre librairie a Douala..."
                    className="min-h-37.5"
                    {...register("message")}
                    disabled={isSubmitting}
                />
                {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
            </div>

            <Button type="submit" className="h-11 w-full" disabled={isSubmitting}>
                {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
            </Button>
        </form>
    );
}
