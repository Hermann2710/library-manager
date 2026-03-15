import "dotenv/config";
import mongoose from "mongoose";
import { Location } from "../lib/models/Location.ts";
import dbConnect from "../lib/mongodb.ts";

const locationsData = [
  { name: "Rayon Informatique - A1", description: "Développement, Langages et Frameworks." },
  { name: "Rayon Informatique - A2", description: "IA, Data Science et Cloud." },
  { name: "Rayon Réseaux - B1", description: "Cyber-sécurité et Infrastructures." },
  { name: "Rayon Sciences - C1", description: "Mathématiques et Logique." },
  { name: "Rayon Design - D1", description: "UX/UI et Graphisme." },
  { name: "Espace Fiction - E1", description: "Romans et Science-Fiction." },
  { name: "Espace Fiction - E2", description: "Dystopies et Thrillers." },
  { name: "Rayon Professionnel", description: "Management, Agile et Soft Skills." },
  { name: "Salle de Lecture - Nord", description: "Ouvrages de référence (consultation sur place)." },
  { name: "Salle de Lecture - Sud", description: "Nouveautés et magazines tech." },
  { name: "Réserve Principale", description: "Archives et éditions limitées." },
  { name: "Espace Jeunesse", description: "Initiation à l'informatique pour enfants." },
  { name: "Rayon Histoire", description: "Histoire des technologies et biographies." },
  { name: "Bureau du Bibliothécaire", description: "Livres en cours de catalogage." },
  { name: "Zone de Retour", description: "Livres récemment retournés, en attente de rangement." }
];

async function seedLocations() {
  try {
    console.log("⏳ Connexion à MongoDB pour les lieux...");
    await dbConnect();

    // Optionnel : On vide uniquement la collection Location
    console.log("🧹 Nettoyage de la collection Location...");
    await Location.deleteMany({});

    console.log("🌱 Insertion des 15 lieux...");
    await Location.insertMany(locationsData);

    console.log("✅ Seeding des lieux terminé avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors du seeding des lieux :", error);
  } finally {
    // On ferme la connexion proprement
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedLocations();