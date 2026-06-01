export default function CGUPage() {
    return (
        <article className="container mx-auto max-w-3xl px-4 py-16">
            <h1 className="mb-8 text-4xl font-bold">Conditions generales d'utilisation</h1>

            <div className="space-y-8 text-muted-foreground">
                <section>
                    <h2 className="mb-4 text-2xl font-semibold text-foreground">1. Objet du service</h2>
                    <p>
                        BiblioGest CM est une application de gestion pour librairies, bibliotheques scolaires, associations et structures privees au Cameroun. Elle aide a cataloguer les ouvrages, suivre les prets, administrer les roles et preparer des suggestions de lecture.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-2xl font-semibold text-foreground">2. Compte utilisateur</h2>
                    <p>
                        Vous etes responsable de la securite de votre compte et des informations saisies pour votre structure.
                    </p>
                </section>

                <section>
                    <h2 className="mb-4 text-2xl font-semibold text-foreground">3. Suggestions assistees</h2>
                    <p>
                        Les suggestions de lecture sont indicatives. Elles peuvent etre generees par requetes catalogue ou, plus tard, par un modele d'IA branche sur vos donnees.
                    </p>
                </section>
            </div>
        </article>
    );
}
