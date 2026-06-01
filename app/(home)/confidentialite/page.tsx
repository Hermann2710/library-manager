export default function PrivacyPage() {
    return (
        <article className="container mx-auto max-w-3xl px-4 py-16">
            <h1 className="mb-3 text-4xl font-bold">Politique de confidentialite</h1>
            <p className="mb-8 text-muted-foreground">Derniere mise a jour : 1 juin 2026</p>

            <div className="space-y-8">
                <section>
                    <h2 className="mb-4 text-2xl font-semibold">1. Donnees collectees</h2>
                    <p className="text-muted-foreground">
                        BiblioGest CM conserve les informations necessaires a votre compte, a votre catalogue, aux membres, au staff et au suivi des prets de votre structure.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-2xl font-semibold">2. Suggestions</h2>
                    <p className="text-muted-foreground">
                        Les suggestions utilisent les donnees de votre catalogue, comme les auteurs, genres, langues, derniers ajouts et mouvements de pret. Ces donnees ne sont pas revendues.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-2xl font-semibold">3. Vos droits</h2>
                    <p className="text-muted-foreground">
                        Vous pouvez demander la correction ou la suppression de vos donnees personnelles depuis les moyens de contact proposes.
                    </p>
                </section>
            </div>
        </article>
    );
}
