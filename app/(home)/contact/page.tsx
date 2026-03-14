import { ContactForm } from "@/components/contact/contact-form";
import { ContactInfo } from "@/components/contact/contact-info";

/**
 * ContactPage Component.
 * Orchestrates the contact section by splitting information and the interactive form.
 * Uses native Tailwind CSS animations for a smooth entry.
 */
export default function ContactPage() {
    return (
        <div className="container mx-auto py-16 px-4">
            <div className="max-w-5xl mx-auto">

                {/* Header section with fade-in and slide-up effect 
                */}
                <div className="text-center space-y-4 mb-12 animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-backwards">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                        Contactez-nous
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Une question sur LibManager.ai ? Notre équipe d'experts est là pour vous accompagner.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start">

                    {/* Left Column: Contact Information (Map, Email, Address)
                        Delayed slightly to follow the header.
                    */}
                    <div className="animate-in fade-in slide-in-from-left-8 duration-700 delay-300 fill-mode-backwards">
                        <ContactInfo />
                    </div>

                    {/* Right Column: Interactive Contact Form
                        Animated from the right for a balanced "gathering" effect.
                    */}
                    <div className="animate-in fade-in slide-in-from-right-8 duration-700 delay-500 fill-mode-backwards">
                        <ContactForm />
                    </div>
                </div>
            </div>
        </div>
    );
}