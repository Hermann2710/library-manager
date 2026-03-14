/**
 * PrivacyPage Component.
 * Displays the privacy policy with sequential fade-in and slide-up animations
 * using only Tailwind CSS utility classes.
 */
export default function PrivacyPage() {
    return (
        <article className="container mx-auto py-16 px-4 max-w-3xl">
            {/* Page Header: Initial animation without delay */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-backwards">
                <h1 className="text-4xl font-bold mb-8">Politique de Confidentialité</h1>
                <p className="text-muted-foreground mb-6">Dernière mise à jour : 12 mars 2026</p>
            </div>

            <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">

                {/* Section 1: Data Collection
                    Animated with a short delay for a "staggered" visual effect.
                */}
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-backwards">
                    <h2 className="text-2xl font-semibold mb-4">1. Collecte des données</h2>
                    <p className="text-muted-foreground">
                        Nous collectons les informations que vous nous fournissez directement lors de la création de votre compte LibManager.ai : nom, adresse e-mail et préférences de lecture.
                    </p>
                </section>

                {/* Section 2: AI Usage 
                    Increased delay to follow the sequential order.
                */}
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-backwards">
                    <h2 className="text-2xl font-semibold mb-4">2. Utilisation de l'IA</h2>
                    <p className="text-muted-foreground">
                        Notre moteur d'IA analyse vos interactions avec la bibliothèque (emprunts, recherches) pour générer des recommandations personnalisées. Ces données sont traitées de manière anonyme et ne sont jamais revendues à des tiers.
                    </p>
                </section>

                {/* Section 3: GDPR Rights 
                    Final section in the animation sequence.
                */}
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-backwards">
                    <h2 className="text-2xl font-semibold mb-4">3. Vos droits (RGPD)</h2>
                    <p className="text-muted-foreground">
                        Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles depuis votre tableau de bord utilisateur.
                    </p>
                </section>
            </div>
        </article>
    );
}