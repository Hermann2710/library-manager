import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Boxes, Brain, Clock, MapPinned, UsersRound } from "lucide-react";

type SuggestedWork = {
    _id: string;
    title: string;
    description?: string;
    badge?: string;
};

type SuggestionBlock = {
    label: string;
    title: string;
    description: string;
    suggestions: SuggestedWork[];
};

export function FeaturesGrid({ suggestionBlock }: { suggestionBlock: SuggestionBlock }) {
    const features = [
        {
            icon: BookOpen,
            title: "Catalogue de structure",
            desc: "Ajoutez les ouvrages, couvertures, auteurs, editeurs et categories de la librairie sans transformer l'app en usine a gaz.",
        },
        {
            icon: UsersRound,
            title: "Prets et lecteurs",
            desc: "Gardez une trace claire des reservations, validations, dates de retour et lecteurs concernes.",
        },
        {
            icon: MapPinned,
            title: "Ou est ce livre ?",
            desc: "Rangez par rayon, salle, etagere ou depot pour retrouver un ouvrage rapidement.",
        },
        {
            icon: Boxes,
            title: "Exemplaires et etat",
            desc: "Suivez l'etat physique de chaque livre : neuf, bon, use, abime ou en maintenance.",
        },
        {
            icon: Clock,
            title: "Historique utile",
            desc: "Retrouvez ce qui a ete lu, prete, rendu ou mis de cote au fil du temps.",
        },
        {
            icon: Brain,
            title: "Suggestions assistees",
            desc: "Un premier assistant prepare des recommandations via requetes catalogue : nouveautes, langues, genres, auteurs et tendances de pret.",
        },
    ];

    const fallbackSuggestions = [
        {
            _id: "fallback-1",
            title: "Un roman court pour reprendre le rythme",
            description: "Suggestion de demarrage quand la structure ne contient pas encore assez de donnees.",
            badge: "FR",
        },
        {
            _id: "fallback-2",
            title: "Un essai lie a vos derniers ajouts",
            description: "La logique pourra interroger vos categories et auteurs favoris.",
            badge: "FR",
        },
        {
            _id: "fallback-3",
            title: "Une relecture oubliee",
            description: "Les livres anciens du catalogue pourront remonter quand ils circulent peu.",
            badge: "FR",
        },
    ];

    const displayedSuggestions = suggestionBlock.suggestions.length > 0 ? suggestionBlock.suggestions : fallbackSuggestions;

    return (
        <section id="bibliotheque" className="container mx-auto px-4 py-16 md:py-20">
            <div className="mb-10 max-w-2xl space-y-3">
                <Badge variant="secondary" className="rounded-md">Pour une structure camerounaise</Badge>
                <h2 className="text-3xl font-black tracking-tight md:text-4xl">
                    Les bons outils pour gerer la librairie au quotidien.
                </h2>
                <p className="text-muted-foreground">
                    BiblioGest CM garde les fonctions du dashboard qui comptent vraiment : cataloguer, preter, retrouver, administrer et suggerer.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => (
                    <Card key={feature.title} className="rounded-lg shadow-none">
                        <CardHeader className="space-y-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                                <feature.icon className="h-5 w-5" />
                            </div>
                            <CardTitle className="text-lg">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm leading-6 text-muted-foreground">
                            {feature.desc}
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div id="suggestions" className="mt-14 grid gap-6 rounded-lg border bg-card p-5 md:grid-cols-[0.8fr_1.2fr] md:p-6">
                <div className="space-y-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
                        <Brain className="h-5 w-5" />
                    </div>
                    <Badge variant="secondary" className="w-fit rounded-md">{suggestionBlock.label}</Badge>
                    <h3 className="text-2xl font-black">{suggestionBlock.title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">
                        {suggestionBlock.description}
                    </p>
                </div>

                <div className="grid gap-3">
                    {displayedSuggestions.map((book) => (
                        <div key={book._id} className="rounded-md border bg-background p-4">
                            <div className="mb-2 flex items-center justify-between gap-3">
                                <h4 className="font-bold">{book.title}</h4>
                                {book.badge && (
                                    <Badge variant="outline" className="rounded-md">
                                        {book.badge}
                                    </Badge>
                                )}
                            </div>
                            <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                                {book.description || "Selection proposee depuis les derniers ajouts du catalogue."}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
