import { Mail, MapPin, Phone } from "lucide-react";

export function ContactInfo() {
    const items = [
        { icon: <Mail />, text: "contact@bibliogest.cm", label: "Email" },
        { icon: <Phone />, text: "+237 6 90 00 00 00", label: "Telephone" },
        { icon: <MapPin />, text: "Douala, Cameroun", label: "Base" },
    ];

    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Informations de contact</h2>
                <p className="text-muted-foreground">
                    Besoin d'aide pour mettre en place la gestion de votre librairie au Cameroun ?
                </p>
            </div>

            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.label} className="flex items-center gap-4 rounded-lg border p-4">
                        <div className="text-primary">{item.icon}</div>
                        <div>
                            <p className="text-xs font-bold uppercase text-muted-foreground">{item.label}</p>
                            <p className="font-medium">{item.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
