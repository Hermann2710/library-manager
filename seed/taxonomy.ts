import "dotenv/config";
import mongoose from "mongoose";
import { Category, Genre } from "../lib/models/Taxonomy.ts";
import dbConnect from "../lib/mongodb.ts";

const categoriesData = [
  { name: "Litterature camerounaise", description: "Romans, essais et classiques produits par des auteurs camerounais." },
  { name: "Litterature africaine", description: "Ouvrages majeurs du continent africain." },
  { name: "Jeunesse et scolaire", description: "Lectures pedagogiques, jeunesse et appui scolaire." },
  { name: "Informatique", description: "Programmation, architecture logicielle et outils numeriques." },
  { name: "Gestion et entrepreneuriat", description: "Management, commerce, organisation et developpement d'activite." },
  { name: "Droit et societe", description: "Citoyennete, droit, institutions et questions sociales." },
  { name: "Histoire et culture", description: "Memoire, patrimoine, histoire locale et regionale." },
  { name: "Langues", description: "Francais, anglais et ressources linguistiques." },
];

const genresData = [
  { name: "Roman" },
  { name: "Essai" },
  { name: "Theatre" },
  { name: "Biographie" },
  { name: "Manuel" },
  { name: "Guide pratique" },
  { name: "Scolaire" },
  { name: "Jeunesse" },
  { name: "Technique" },
  { name: "Classique" },
];

async function seedTaxonomy() {
  try {
    console.log("Connexion MongoDB - taxonomie");
    await dbConnect();

    await Category.deleteMany({});
    await Genre.deleteMany({});

    await Category.insertMany(categoriesData);
    await Genre.insertMany(genresData);

    console.log("Taxonomie seedee avec succes");
  } catch (error) {
    console.error("Erreur seeding taxonomie:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedTaxonomy();
