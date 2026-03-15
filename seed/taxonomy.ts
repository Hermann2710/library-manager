import "dotenv/config";
import mongoose from "mongoose";
import { Category, Genre } from "../lib/models/Taxonomy.ts";
import dbConnect from "../lib/mongodb.ts";

const categoriesData = [
  { name: "Développement Web", description: "Maîtrisez React, Next.js et les technologies frontend modernes." },
  { name: "Intelligence Artificielle", description: "Exploration des LLM, du Machine Learning et du Deep Learning." },
  { name: "Cyber-sécurité", description: "Protocoles de défense, tests d'intrusion et sécurité réseau." },
  { name: "Base de données", description: "Architecture SQL, NoSQL et optimisation des performances." },
  { name: "Science-Fiction", description: "Récits d'anticipation, voyages spatiaux et futurs technologiques." },
  { name: "Design & UX/UI", description: "Principes d'ergonomie, de psychologie cognitive et de design visuel." },
  { name: "Développement Mobile", description: "Création d'applications natives et cross-platform (Flutter, React Native)." },
  { name: "Management Agile", description: "Méthodologies Scrum, Kanban et gestion de projets complexes." },
  { name: "Algorithmique", description: "Structures de données, complexité et résolution de problèmes." },
  { name: "Cloud Computing", description: "Déploiement, serverless et architecture micro-services sur AWS/Vercel." },
  { name: "Développement Personnel", description: "Productivité, gestion du temps et soft skills pour développeurs." },
  { name: "Histoire des Tech", description: "L'évolution de l'informatique, des premiers ordinateurs au Web3." },
  { name: "Langages de Bas Niveau", description: "Apprentissage du C, C++ et Rust pour la performance système." },
  { name: "DevOps", description: "Automatisation, CI/CD, Docker et orchestration avec Kubernetes." },
  { name: "Mathématiques pour l'informatique", description: "Logique, probabilités et algèbre linéaire pour la programmation." }
];

const genresData = [
  { name: "Technique" }, { name: "Roman" }, { name: "Essai" }, 
  { name: "Biographie" }, { name: "Manuel" }, { name: "Dystopie" },
  { name: "Thriller" }, { name: "Fantaisie" }, { name: "Académique" },
  { name: "Professionnel" }, { name: "Guide" }, { name: "Historique" },
  { name: "Poésie" }, { name: "Jeunesse" }, { name: "BD/Manga" }
];

async function seedTaxonomy() {
  try {
    console.log("⏳ Connexion à MongoDB pour la taxonomie...");
    await dbConnect();

    // Nettoyage des anciennes données
    console.log("🧹 Nettoyage des collections Category et Genre...");
    await Category.deleteMany({});
    await Genre.deleteMany({});

    // Insertion des données
    console.log("🌱 Insertion des 15 catégories...");
    await Category.insertMany(categoriesData);

    console.log("🌱 Insertion des 15 genres...");
    await Genre.insertMany(genresData);

    console.log("✅ Seeding de la taxonomie terminé avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors du seeding de la taxonomie :", error);
  } finally {
    // Fermeture de la connexion pour rendre la main au terminal
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedTaxonomy();