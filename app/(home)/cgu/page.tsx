export default function CGUPage() {
    return (
        <article className="container mx-auto py-16 px-4 max-w-3xl">
            <h1 className="text-4xl font-bold mb-8">Conditions Générales d'Utilisation</h1>

            <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-muted-foreground">
                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Objet du service</h2>
                    <p>
                        LibManager.ai fournit une plateforme logicielle SaaS pour la gestion de bibliothèques physiques et numériques. L'accès au service est conditionné par l'acceptation des présentes CGU.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Comptes Utilisateurs</h2>
                    <p>
                        Vous êtes responsable de la sécurité de votre mot de passe. Toute activité suspecte doit nous être signalée immédiatement via notre formulaire de contact.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Limitation de responsabilité</h2>
                    <p>
                        Bien que nous utilisions des algorithmes d'IA avancés, LibManager.ai ne peut garantir l'exactitude absolue des suggestions de lecture et n'est pas responsable des décisions prises sur la base de ces recommandations.
                    </p>
                </section>
            </div>
        </article>
    );
}