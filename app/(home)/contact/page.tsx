import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";

export default function ContactPage() {
    return (
        <div className="container mx-auto py-16 px-4">
            <div className="max-w-5xl mx-auto">
                <div className="text-center space-y-4 mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Contactez-nous</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Une question sur LibManager.ai ? Notre équipe d'experts est là pour vous accompagner.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Informations à gauche */}
                    <ContactInfo />

                    {/* Formulaire à droite */}
                    <ContactForm />
                </div>
            </div>
        </div>
    );
}