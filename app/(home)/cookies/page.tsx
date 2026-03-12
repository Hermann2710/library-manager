import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function CookiesPage() {
    return (
        <article className="container mx-auto py-16 px-4 max-w-3xl text-muted-foreground">
            <h1 className="text-4xl font-bold mb-8 text-foreground">Politique des Cookies</h1>

            <p className="mb-8">
                LibManager.ai utilise des cookies pour améliorer votre navigation et mémoriser vos préférences (comme le mode sombre).
            </p>

            <div className="border rounded-lg overflow-hidden mb-8">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead>Nom</TableHead>
                            <TableHead>Usage</TableHead>
                            <TableHead>Durée</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium text-foreground">next-auth.session</TableCell>
                            <TableCell>Maintien de la session utilisateur</TableCell>
                            <TableCell>30 jours</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium text-foreground">next-themes</TableCell>
                            <TableCell>Mémorisation du thème (Clair/Sombre)</TableCell>
                            <TableCell>Persistant</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium text-foreground">_ga</TableCell>
                            <TableCell>Statistiques de visites anonymes</TableCell>
                            <TableCell>2 ans</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            <h2 className="text-2xl font-semibold mb-4 text-foreground">Comment désactiver les cookies ?</h2>
            <p>
                Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela pourrait impacter le bon fonctionnement de l'application (notamment la connexion à votre compte).
            </p>
        </article>
    );
}