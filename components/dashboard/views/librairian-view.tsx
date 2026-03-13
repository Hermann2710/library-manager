import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookUp, Users, ClipboardCheck } from "lucide-react";

export default function LibrarianView() {
    return (
        <div className="grid gap-6 md:grid-cols-3">
            <header className="md:col-span-3">
                <h2 className="text-xs font-black uppercase tracking-widest text-primary mb-1">Gestionnaire de Flux</h2>
                <p className="text-sm text-muted-foreground font-medium">Suivi des activités de prêt et des membres.</p>
            </header>

            <LibrarianStat title="Prêts à valider" value={12} icon={ClipboardCheck} color="text-amber-500" />
            <LibrarianStat title="Retours du jour" value={5} icon={BookUp} color="text-blue-500" />
            <LibrarianStat title="Nouveaux Membres" value={3} icon={Users} color="text-emerald-500" />

            <Card className="md:col-span-3 border-none bg-muted/5">
                <CardHeader>
                    <CardTitle className="text-sm font-black uppercase italic">Dernières Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Aucune demande en attente.</p>
                </CardContent>
            </Card>
        </div>
    );
}

function LibrarianStat({ title, value, icon: Icon, color }: any) {
    return (
        <Card className="border-none bg-muted/5">
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">{title}</p>
                        <p className="text-3xl font-black">{value}</p>
                    </div>
                    <div className={`p-3 rounded-xl bg-background shadow-sm ${color}`}>
                        <Icon className="h-5 w-5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}