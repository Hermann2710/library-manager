import { DashboardContainer } from "@/components/shared/dashboard-container";
import { Settings, Bell, Lock, Palette, Globe, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export default function SettingsPage() {
    return (
        <DashboardContainer
            title="CONFIGURATION"
            subtitle="Préférences"
            description="Personnalisez votre expérience et configurez les paramètres de sécurité du compte."
            actions={
                <Button className="rounded-full font-black uppercase text-[10px] tracking-widest px-8 italic">
                    <Save className="mr-2 h-4 w-4" /> Enregistrer
                </Button>
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Section Notifications */}
                <SettingsCard
                    title="Notifications"
                    icon={Bell}
                    description="Gérez comment vous recevez les alertes de prêt et de retour."
                >
                    <div className="space-y-4">
                        <ToggleRow label="Alertes par email" description="Recevoir un mail pour chaque retour" defaultChecked />
                        <ToggleRow label="Rappels de retard" description="Notifications automatiques J-2" defaultChecked />
                    </div>
                </SettingsCard>

                {/* Section Sécurité */}
                <SettingsCard
                    title="Sécurité"
                    icon={Lock}
                    description="Protégez votre compte avec des mesures de sécurité avancées."
                >
                    <div className="space-y-4">
                        <ToggleRow label="Double authentification" description="Sécuriser via mobile" />
                        <Button variant="outline" className="w-full rounded-xl text-[10px] font-black uppercase">
                            Changer le mot de passe
                        </Button>
                    </div>
                </SettingsCard>

                {/* Section Interface */}
                <SettingsCard
                    title="Interface"
                    icon={Palette}
                    description="Adaptez l'apparence du tableau de bord à vos besoins."
                >
                    <div className="space-y-4">
                        <ToggleRow label="Mode sombre automatique" description="Basé sur le système" defaultChecked />
                        <ToggleRow label="Animations réduites" description="Pour plus de performance" />
                    </div>
                </SettingsCard>
            </div>
        </DashboardContainer>
    );
}

function SettingsCard({ title, icon: Icon, description, children }: { title: string, icon: any, description: string, children: React.ReactNode }) {
    return (
        <div className="bg-card border rounded-[2.5rem] p-8 space-y-6 shadow-sm">
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary">
                    <Icon className="h-5 w-5" />
                    <h3 className="font-black uppercase italic tracking-tighter">{title}</h3>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
            </div>
            <div className="pt-2">{children}</div>
        </div>
    );
}

function ToggleRow({ label, description, defaultChecked = false }: { label: string, description: string, defaultChecked?: boolean }) {
    return (
        <div className="flex items-center justify-between p-4 bg-muted/10 rounded-2xl border border-muted/5">
            <div className="space-y-0.5">
                <p className="text-xs font-bold uppercase tracking-tight">{label}</p>
                <p className="text-[10px] text-muted-foreground">{description}</p>
            </div>
            <Switch defaultChecked={defaultChecked} />
        </div>
    );
}