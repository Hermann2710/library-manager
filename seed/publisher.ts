import "dotenv/config";
import mongoose from "mongoose";
import { Publisher } from "../lib/models/Publisher.ts";
import dbConnect from "../lib/mongodb.ts";

const publishersData = [
  { name: "Editions CLE", website: "https://editionscle.com", email: "contact@editionscle.com", address: "Yaounde, Cameroun" },
  { name: "Presses Universitaires de Yaounde", website: "https://uy1.uninet.cm", email: "info@uy1.uninet.cm", address: "Yaounde, Cameroun" },
  { name: "Presence Africaine", website: "https://presenceafricaine.com", email: "contact@presenceafricaine.com", address: "Paris, France" },
  { name: "Actes Sud", website: "https://www.actes-sud.fr", email: "contact@actes-sud.fr", address: "Arles, France" },
  { name: "Hatier", website: "https://www.editions-hatier.fr", email: "contact@editions-hatier.fr", address: "Paris, France" },
  { name: "Gallimard", website: "https://www.gallimard.fr", email: "contact@gallimard.fr", address: "Paris, France" },
  { name: "Heinemann", website: "https://www.heinemann.com", email: "support@heinemann.com", address: "Portsmouth, USA" },
  { name: "Pearson Education", website: "https://www.pearson.com", email: "contact@pearson.com", address: "London, UK" },
  { name: "Addison-Wesley", website: "https://www.pearson.com", email: "info@pearson.com", address: "Boston, USA" },
  { name: "O'Reilly Media", website: "https://www.oreilly.com", email: "support@oreilly.com", address: "Sebastopol, USA" },
  { name: "Currency", website: "https://www.penguinrandomhouse.com", email: "contact@penguinrandomhouse.com", address: "New York, USA" },
];

async function seedPublishers() {
  try {
    console.log("Connexion MongoDB - editeurs");
    await dbConnect();

    await Publisher.deleteMany({});
    await Publisher.insertMany(publishersData);

    console.log("Editeurs seedes avec succes");
  } catch (error) {
    console.error("Erreur seeding editeurs:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedPublishers();
