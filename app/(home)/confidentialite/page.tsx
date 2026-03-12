export default function PrivacyPage() {
    return (
        <article className="container mx-auto py-16 px-4 max-w-3xl">
            <h1 className="text-4xl font-bold mb-8">Politique de Confidentialité</h1>
            <p className="text-muted-foreground mb-6">Dernière mise à jour : 12 mars 2026</p>

            <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
                <section>
                    <h2 className="text-2xl font-semibold mb-4">1. Collecte des données</h2>
                    <p className="text-muted-foreground">
                        Nous collectons les informations que vous nous fournissez directement lors de la création de votre compte LibManager.ai : nom, adresse e-mail et préférences de lecture.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">2. Utilisation de l'IA</h2>
                    <p className="text-muted-foreground">
                        Notre moteur d'IA analyse vos interactions avec la bibliothèque (emprunts, recherches) pour générer des recommandations personnalisées. Ces données sont traitées de manière anonyme et ne sont jamais revendues à des tiers.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">3. Vos droits (RGPD)</h2>
                    <p className="text-muted-foreground">
                        Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles depuis votre tableau de bord utilisateur.
                    </p>
                </section>
            </div>
        </article>
    );
}