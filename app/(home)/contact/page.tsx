import { ContactForm } from "./_components/contact-form";
import { ContactInfo } from "./_components/contact-info";

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="mx-auto max-w-5xl">
                <div className="mb-12 space-y-4 text-center">
                    <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Contact</h1>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                        Une question sur BiblioGest CM ou sur la gestion de votre librairie au Cameroun ? Ecrivez-nous.
                    </p>
                </div>

                <div className="grid items-start gap-12 md:grid-cols-2">
                    <ContactInfo />
                    <ContactForm />
                </div>
            </div>
        </div>
    );
}
