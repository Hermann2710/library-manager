/**
 * CGUPage Component.
 * Uses native Tailwind CSS animations (animate-in, fade-in, slide-in)
 * to create a professional look without external motion libraries.
 */
export default function CGUPage() {
    return (
        <article className="container mx-auto py-16 px-4 max-w-3xl">
            {/* Title with a simple fade-in and slide-up animation */}
            <h1 className="text-4xl font-bold mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                Conditions Générales d'Utilisation
            </h1>

            <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-muted-foreground">

                {/* Section 1: Object of the service
                    Uses 'fill-mode-backwards' to keep it invisible before the animation starts.
                */}
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-backwards">
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Objet du service</h2>
                    <p>
                        LibManager.ai fournit une plateforme logicielle SaaS pour la gestion de bibliothèques physiques et numériques. L'accès au service est conditionné par l'acceptation des présentes CGU.
                    </p>
                </section>

                {/* Section 2: User Accounts 
                    Increased delay to create a sequential entrance effect.
                */}
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 fill-mode-backwards">
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Comptes Utilisateurs</h2>
                    <p>
                        Vous êtes responsable de la sécurité de votre mot de passe. Toute activité suspecte doit nous être signalée immédiatement via notre formulaire de contact.
                    </p>
                </section>

                {/* Section 3: AI Liability 
                    Final section in the sequence.
                */}
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-backwards">
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Limitation de responsabilité</h2>
                    <p>
                        Bien que nous utilisions des algorithmes d'IA avancés, LibManager.ai ne peut garantir l'exactitude absolue des suggestions de lecture et n'est pas responsable des décisions prises sur la base de ces recommandations.
                    </p>
                </section>
            </div>
        </article>
    );
}