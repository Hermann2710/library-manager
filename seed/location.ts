import "dotenv/config";
import mongoose from "mongoose";
import { Location } from "../lib/models/Location.ts";
import dbConnect from "../lib/mongodb.ts";

const locationsData = [
  { name: "Rayon A1 - Litterature camerounaise", description: "Classiques et romans camerounais." },
  { name: "Rayon A2 - Litterature africaine", description: "Romans et essais africains." },
  { name: "Rayon B1 - Scolaire et jeunesse", description: "Manuels, jeunesse et lectures scolaires." },
  { name: "Rayon C1 - Informatique", description: "Programmation, architecture et methodes techniques." },
  { name: "Rayon D1 - Gestion", description: "Entrepreneuriat, management et commerce." },
  { name: "Comptoir - Nouveautes", description: "Ouvrages recemment ajoutes ou recommandes." },
  { name: "Reserve principale", description: "Stock supplementaire et exemplaires de remplacement." },
  { name: "Zone retour", description: "Exemplaires retournes en attente de rangement." },
];

async function seedLocations() {
  try {
    console.log("Connexion MongoDB - emplacements");
    await dbConnect();

    await Location.deleteMany({});
    await Location.insertMany(locationsData);

    console.log("Emplacements seedes avec succes");
  } catch (error) {
    console.error("Erreur seeding emplacements:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedLocations();
