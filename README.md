# 📚 Library Manager | Next.js, MongoDB & TanStack

Système de gestion de bibliothèque haute performance bâti avec **Next.js 16 (App Router)**. Cette application propose une double interface (Lecteurs et Bibliothécaires), s'appuyant sur **MongoDB** pour la flexibilité des données et **Auth.js** pour une authentification sécurisée par rôles.

## 🚀 Stack Technique

- **Framework :** [Next.js 16 (App Router)](https://nextjs.org/)
- **Langage :** [TypeScript](https://www.typescript.org/)
- **Base de données :** [MongoDB](https://www.mongodb.com/) avec [Mongoose](https://mongoosejs.com/)
- **Authentification :** [Auth.js (v5)](https://authjs.dev/)
- **Gestion des données :** [TanStack Query (React Query)](https://tanstack.com/query) pour le fetch et le cache.
- **Tableaux :** [TanStack Table (React Table)](https://tanstack.com/table) pour la gestion des listes de livres.
- **UI & Design :** [Shadcn UI](https://ui.shadcn.com/) & [Tailwind CSS](https://tailwindcss.com/)
- **Gestion de formulaires :** [React Hook Form](https://react-hook-form.com/) avec validation [Zod](https://zod.dev/)
- **Thèmes :** [Next-Themes](https://github.com/pacocoursey/next-themes) (Mode sombre/clair)
- **État Global :** Context API (`main-context`)

## 🛠 Fonctionnalités

### 📖 Côté Lecteur (Utilisateur)
- **Catalogue Optimisé :** Affichage performant des livres avec mise en cache via React Query.
- **Tableau de bord :** Suivi des emprunts actifs et historique de lecture.
- **Interface Fluide :** Changement de thèmes et composants accessibles via Shadcn UI.

### 🔐 Côté Bibliothécaire (Admin)
- **Gestion de l'Inventaire :** Tableaux complexes avec tri, filtrage et pagination via TanStack Table.
- **Validation Robuste :** Formulaires sécurisés avec React Hook Form et Zod.
- **Sécurité :** Routes administratives protégées par middleware selon les rôles.

## 📁 Structure du Projet

```text
├── app/
│   ├── (auth)/           # Connexion et Inscription
│   ├── (reader)/         # Catalogue et profil utilisateur
│   ├── admin/            # Dashboard bibliothécaire (Protégé)
│   └── api/              # Routes API (Endpoints pour React Query)
├── components/           
│   ├── ui/               # Composants Shadcn UI
│   ├── tables/           # Configurations TanStack Table
│   └── shared/           # Composants métier réutilisables
├── context/
│   └── main-context.tsx  # État global (Sidebar, Rôles)
├── lib/
│   ├── models/           # Schémas Mongoose (Book, User, Loan)
│   ├── validation/       # Schémas de validation Zod
│   ├── mongodb.ts        # Singleton de connexion base de données
│   └── query-client.ts   # Configuration TanStack Query
└── auth.ts               # Configuration Auth.js