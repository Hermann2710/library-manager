# BiblioGest Cameroun

Application web de gestion interne pour une librairie/bibliotheque au Cameroun. Elle centralise le catalogue, les exemplaires, les membres, les prets, les retours, les statistiques et les profils utilisateurs avec controle d'acces par role.

## Stack technique

- Next.js 16 App Router, React 19 et TypeScript.
- MongoDB avec Mongoose, base forcee sur `bibliogest`.
- Auth.js v5 avec Credentials, Google et GitHub.
- Tailwind CSS 4, Radix UI, shadcn/ui et lucide-react.
- TanStack Query, TanStack Table et Recharts.
- Cloudinary pour l'upload des images.
- jsPDF, jspdf-autotable et PapaParse pour les exports.

## Fonctionnalites principales

- Authentification avec linking OAuth par email.
- RBAC pour `admin`, `librarian` et `reader`.
- Dashboard adapte au role connecte.
- Catalogue : auteurs, editeurs, categories, genres, ouvrages et exemplaires.
- Gestion des membres, prets, retours et retards.
- Profil utilisateur en tabs avec image, contact et adresse modifiables.
- Upload Cloudinary pour les couvertures et avatars.
- Statistiques admin avec graphiques Recharts stylises, exports CSV/PDF et etats vides.
- Theme clair/sombre coherent et interface responsive.

## Installation

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Renseigner les variables de `.env` avant de lancer l'authentification OAuth, MongoDB ou Cloudinary.

## Scripts utiles

```bash
pnpm dev
pnpm build
npx tsc --noEmit
pnpm seed:all
```

## Variables d'environnement

Un exemple complet est disponible dans `.env.example`.

Cloudinary supporte deux modes :

- preset unsigned avec `CLOUDINARY_UPLOAD_PRESET` ;
- signature serveur avec `CLOUDINARY_API_KEY` et `CLOUDINARY_API_SECRET`.

## Structure

```bash
actions/      Server Actions
app/          Routes App Router, pages et API
components/   Composants UI partages et dashboard
docs/         UML, stack, Gantt et support de rapport de stage
lib/          Connexion MongoDB, modeles Mongoose, validations et RBAC
seed/         Donnees initiales coherentes avec le contexte camerounais
```

## Documentation

- `docs/stage/README.md`
- `docs/stage/stack-et-outils.md`
- `docs/stage/rapport-stage.md`
- `docs/stage/gantt.md`
- `docs/stage/cahier-recette.md`
- `docs/uml/class-diagram.md`
- `docs/uml/use-case-diagram.md`
- `docs/uml/sequence-reservation.md`
- `docs/uml/sequence-upload-cloudinary.md`
- `docs/uml/rbac-flow.md`
