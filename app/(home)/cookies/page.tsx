import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

/**
 * CookiesPage Component.
 * Presents cookie usage information in a structured table.
 * Includes entrance animations for better visual flow.
 */
export default function CookiesPage() {
    return (
        <article className="container mx-auto py-16 px-4 max-w-3xl text-muted-foreground">
            {/* Header: Simple fade-in animation */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-backwards">
                <h1 className="text-4xl font-bold mb-8 text-foreground">Politique des Cookies</h1>

                <p className="mb-8">
                    LibManager.ai utilise des cookies pour améliorer votre navigation et mémoriser vos préférences (comme le mode sombre).
                </p>
            </div>

            {/* Cookie Details Table: Animated container with a slight delay 
                The border and rounded-lg classes match the Shadcn UI design system.
            */}
            <div className="border rounded-lg overflow-hidden mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300 fill-mode-backwards">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-muted/50">
                            <TableHead>Nom</TableHead>
                            <TableHead>Usage</TableHead>
                            <TableHead>Durée</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {/* Session Cookie: Critical for Next-Auth functionality */}
                        <TableRow>
                            <TableCell className="font-medium text-foreground">next-auth.session</TableCell>
                            <TableCell>Maintien de la session utilisateur</TableCell>
                            <TableCell>30 jours</TableCell>
                        </TableRow>

                        {/* Theme Cookie: Persists dark/light mode choice */}
                        <TableRow>
                            <TableCell className="font-medium text-foreground">next-themes</TableCell>
                            <TableCell>Mémorisation du thème (Clair/Sombre)</TableCell>
                            <TableCell>Persistant</TableCell>
                        </TableRow>

                        {/* Analytics Cookie: Optional anonymous tracking */}
                        <TableRow>
                            <TableCell className="font-medium text-foreground">_ga</TableCell>
                            <TableCell>Statistiques de visites anonymes</TableCell>
                            <TableCell>2 ans</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            {/* Footer Section: Instructions for cookie management */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-backwards">
                <h2 className="text-2xl font-semibold mb-4 text-foreground">Comment désactiver les cookies ?</h2>
                <p>
                    Vous pouvez configurer votre navigateur pour refuser les cookies, mais cela pourrait impacter le bon fonctionnement de l'application (notamment la connexion à votre compte).
                </p>
            </div>
        </article>
    );
}