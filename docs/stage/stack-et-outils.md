# Stack, outils et technologies

## Stack applicative

| Couche | Technologie | Role dans le projet |
| --- | --- | --- |
| Framework web | Next.js 16 App Router | Routage, Server Components, Server Actions, API routes et rendu hybride |
| Langage | TypeScript | Typage statique et meilleure maintenabilite |
| Interface | React 19 | Construction des composants interactifs |
| Style | Tailwind CSS 4 | Design system utilitaire et responsive |
| Composants UI | Radix UI, shadcn/ui, lucide-react | Composants accessibles, icones et primitives d'interface |
| Formulaires | React Hook Form, Zod | Gestion des formulaires et validation schema |
| Authentification | NextAuth/Auth.js v5 | Sessions, connexion credentials/OAuth et controle des roles |
| Base de donnees | MongoDB | Stockage des utilisateurs, livres, exemplaires, membres et prets |
| ODM | Mongoose | Modelisation, schemas et acces aux collections MongoDB |
| Upload media | Cloudinary | Hebergement des images de livres et profils |
| Etat client | TanStack Query | Recuperation, cache et synchronisation des donnees cote client |
| Tableaux | TanStack Table | Tableaux de donnees filtrables et structurables |
| Graphiques | Recharts | Visualisation stylisee des classements du dashboard admin |
| Notifications UI | Sonner | Messages de succes, erreur et feedback utilisateur |
| Export | jsPDF, jspdf-autotable, PapaParse | Export PDF/CSV pour les donnees de gestion |

## Outils de developpement

| Outil | Usage |
| --- | --- |
| Node.js | Runtime JavaScript |
| pnpm/npm | Installation des dependances et scripts projet |
| ESLint | Verification de la qualite du code |
| TypeScript Compiler | Controle de type avec `tsc --noEmit` |
| Git | Versionnement du code source |
| GitHub ou remote Git | Sauvegarde et partage du depot |
| VS Code | Edition du code et navigation projet |
| MongoDB Atlas ou MongoDB local | Environnement de base de donnees |
| Cloudinary Console | Configuration cloud, preset et dossiers media |

## Conventions retenues

- Architecture par routes Next.js avec dossiers locaux `_components` et `_actions`.
- Server Actions pour les mutations sensibles et les traitements proches du serveur.
- API route dediee a l'upload Cloudinary.
- Acces aux pages protege par role : `admin`, `librarian`, `reader`.
- Fichiers de page courts, avec delegation vers composants locaux.
- Seeders coherents avec une librairie/bibliotheque camerounaise.
- Design responsive mobile, tablette et desktop.
- Graphiques admin avec etats vides, tooltip lisible et exports CSV/PDF.

## Variables d'environnement principales

```env
MONGODB_URI=
AUTH_SECRET=
AUTH_URL=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_GITHUB_ID=
AUTH_GITHUB_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_UPLOAD_PRESET=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_FOLDER=
```

Selon la configuration Cloudinary, l'application peut utiliser soit un preset unsigned, soit une signature serveur via `CLOUDINARY_API_KEY` et `CLOUDINARY_API_SECRET`.
