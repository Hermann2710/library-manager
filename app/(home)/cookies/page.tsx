import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function CookiesPage() {
    return (
        <article className="container mx-auto max-w-3xl px-4 py-16 text-muted-foreground">
            <h1 className="mb-8 text-4xl font-bold text-foreground">Politique des cookies</h1>
            <p className="mb-8">
                BiblioGest CM utilise quelques cookies techniques pour maintenir la session et memoriser vos preferences.
            </p>

            <div className="mb-8 overflow-hidden rounded-lg border">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead>Nom</TableHead>
                            <TableHead>Usage</TableHead>
                            <TableHead>Duree</TableHead>
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
                            <TableCell>Memorisation du theme</TableCell>
                            <TableCell>Persistant</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            <h2 className="mb-4 text-2xl font-semibold text-foreground">Desactiver les cookies</h2>
            <p>
                Vous pouvez refuser les cookies depuis votre navigateur, mais la connexion et certaines preferences peuvent ne plus fonctionner correctement.
            </p>
        </article>
    );
}
