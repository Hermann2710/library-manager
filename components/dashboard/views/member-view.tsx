import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BookOpen, Clock, AlertCircle } from "lucide-react";

export default function MemberView({ user }: { user: any }) {
    return (
        <div className="grid gap-6 md:grid-cols-3">
            {/* KPI simples pour le membre */}
            <QuickStat title="Livres empruntés" value={2} icon={BookOpen} />
            <QuickStat title="À rendre bientôt" value={1} icon={Clock} />
            <QuickStat title="Retards" value={0} icon={AlertCircle} color="text-red-500" />

            <Card className="md:col-span-3 border-none bg-muted/5">
                <CardHeader>
                    <CardTitle className="text-sm font-black uppercase italic">Mes emprunts en cours</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground font-bold uppercase">Aucun emprunt actif pour le moment.</p>
                </CardContent>
            </Card>
        </div>
    );
}

function QuickStat({ title, value, icon: Icon, color = "text-primary" }: any) {
    return (
        <Card className="border-none bg-muted/5">
            <CardContent className="pt-6 flex items-center justify-between">
                <div>
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">{title}</p>
                    <p className="text-2xl font-black">{value}</p>
                </div>
                <Icon className={`h-8 w-8 ${color} opacity-20`} />
            </CardContent>
        </Card>
    );
}