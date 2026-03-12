import { Mail, Phone, MapPin } from "lucide-react";

export function ContactInfo() {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Informations de contact</h2>
                <p className="text-muted-foreground">Besoin d'une démonstration personnalisée ou d'un devis ?</p>
            </div>
            <div className="space-y-4">
                {[
                    { icon: <Mail />, text: "contact@libmanager.ai", label: "Email" },
                    { icon: <Phone />, text: "+33 1 23 45 67 89", label: "Téléphone" },
                    { icon: <MapPin />, text: "123 Avenue de l'IA, Paris, France", label: "Bureau" },
                ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border rounded-xl">
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