# 📚 Library Manager | Next.js, MongoDB & TanStack

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green?style=flat-square&logo=mongodb)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)

Système de gestion de bibliothèque moderne et haute performance conçu avec l'**App Router de Next.js**. Cette application propose une expérience hybride où la gestion administrative côtoie l'espace personnel des lecteurs dans une interface fluide et sécurisée.

## 🚀 Stack Technique

* **Framework :** [Next.js 16 (App Router)](https://nextjs.org/) avec exploitation de **Turbopack**.
* **Langage :** [TypeScript](https://www.typescript.org/) pour un typage rigoureux de bout en bout.
* **Base de données :** [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/).
* **Authentification :** [Auth.js (v5)](https://authjs.dev/) - Multi-provider (Google, GitHub, Credentials).
* **Gestion des données :** [TanStack Query](https://tanstack.com/query) & [React Table](https://tanstack.com/table).
* **UI & Design :** [Shadcn UI](https://ui.shadcn.com/), [Tailwind CSS](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/).
* **Formulaires :** [React Hook Form](https://react-hook-form.com/) + validation [Zod](https://zod.dev/).

## 🛠 Fonctionnalités Clés

### 🔑 Authentification & Accès
* **OAuth Ready :** Connexion simplifiée via Google ou GitHub.
* **Auto-Membership :** Génération automatique d'une identité membre (`MEM-2026-XXXX`) dès la première connexion via OAuth.
* **RBAC (Role-Based Access Control) :** Gestion des permissions pour les rôles `Admin`, `Librarian`, et `Reader`.

### 📊 Dashboards Hybrides & Intelligents
* **Personal First :** Chaque utilisateur, quel que soit son grade, dispose de sa vue **Membre** (emprunts, dates de retour, alertes).
* **Librarian Hub :** Flux opérationnel en temps réel pour la validation des prêts et la gestion des retours quotidiens.
* **Admin Analytics :** Tableaux de bord décisionnels basés sur des pipelines d'agrégation MongoDB (Top livres, auteurs, catégories).

### ⚡️ Expérience Utilisateur (UX)
* **Streaming & Suspense :** Chargement asynchrone des statistiques lourdes avec des *skeletons* pour une interface toujours réactive.
* **Theme Management :** Support natif du mode sombre et clair avec `next-themes`.
* **Server Actions :** Mutations de données sécurisées et performantes sans rechargement de page.

## 📂 Structure du Projet

```bash
├── actions/           # Server Actions (Auth, Members, Loans, Notifications)
├── app/               # App Router (Routes, Layouts & API)
├── components/        # UI (auth, dashboard, shared, ui)
├── lib/               # Modèles Mongoose, validations Zod, MongoDB config
├── hooks/             # Hooks personnalisés
└── public/            # Assets et icônes
```

## Configuration Cloudinary

L'API `/api/upload` envoie les fichiers vers Cloudinary. Deux modes sont supportes :

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
CLOUDINARY_FOLDER=library-manager
```

Ou avec signature serveur :

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=library-manager
```

## Diagrammes UML

- `docs/uml/class-diagram.md`
- `docs/uml/use-case-diagram.md`
- `docs/uml/sequence-reservation.md`
- `docs/uml/sequence-upload-cloudinary.md`
- `docs/uml/rbac-flow.md`

## Documentation de stage

- `docs/stage/README.md`
- `docs/stage/stack-et-outils.md`
- `docs/stage/rapport-stage.md`
- `docs/stage/gantt.md`
- `docs/stage/cahier-recette.md`
