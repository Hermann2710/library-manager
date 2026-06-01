# Cahier de recette

Ce document liste les controles a effectuer avant livraison ou demonstration.

## Authentification et roles

| Scenario | Role | Resultat attendu |
| --- | --- | --- |
| Connexion avec identifiants valides | Tous | Creation d'une session et redirection vers le dashboard |
| Acces au dashboard admin | admin | Page accessible avec statistiques et actions d'administration |
| Acces au dashboard bibliothecaire | librarian | Page accessible avec actions de pret, retour et catalogue |
| Acces lecteur a une page reservee admin | reader | Acces refuse ou redirection |
| Command palette du dashboard | Tous | Commandes filtrees selon le role connecte |

## Catalogue et exemplaires

| Scenario | Resultat attendu |
| --- | --- |
| Creation ou modification d'un ouvrage | Donnees sauvegardees et visibles dans le catalogue |
| Upload d'une couverture | Image envoyee sur Cloudinary et URL stockee |
| Recherche d'un ouvrage | Resultats pertinents et temps de reponse acceptable |
| Consultation d'un exemplaire | Statut, emplacement et disponibilite visibles |

## Membres, prets et retours

| Scenario | Resultat attendu |
| --- | --- |
| Creation d'une fiche membre | Code membre genere et profil lie au compte |
| Enregistrement d'un pret | Exemplaire marque comme emprunte |
| Retour d'un exemplaire | Statut mis a jour et historique conserve |
| Pret en retard | Indicateur visible dans le dashboard et le profil |

## Profil utilisateur

| Scenario | Resultat attendu |
| --- | --- |
| Consultation du profil | Informations organisees en tabs |
| Modification du nom, email ou image | Profil et session synchronises |
| Changement de theme | Theme coherent sur toute l'application |
| Consultation activite | Emprunts recents et statistiques visibles |

## Responsive et interface

| Controle | Resultat attendu |
| --- | --- |
| Mobile 360px | Aucun chevauchement, navigation utilisable |
| Tablette | Dashboard lisible et actions accessibles |
| Desktop | Tableaux, cards et graphiques bien alignes |
| Mode clair/sombre | Couleurs lisibles et composants coherents |

## Verification technique

```bash
npx tsc --noEmit
npm run build
```

Les deux commandes doivent terminer sans erreur avant livraison.
