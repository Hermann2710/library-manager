import "dotenv/config";
import mongoose from "mongoose";
import { Publisher } from "../lib/models/Publisher.ts";
import dbConnect from "../lib/mongodb.ts";

const publishersData = [
  { name: "O'Reilly Media", website: "https://www.oreilly.com", email: "support@oreilly.com", address: "Sebastopol, CA, USA" },
  { name: "Addison-Wesley", website: "https://www.pearson.com", email: "info@addison-wesley.com", address: "Boston, MA, USA" },
  { name: "Manning Publications", website: "https://www.manning.com", email: "support@manning.com", address: "Shelter Island, NY, USA" },
  { name: "Packt Publishing", website: "https://www.packtpub.com", email: "info@packtpub.com", address: "Birmingham, UK" },
  { name: "Pearson Education", website: "https://www.pearson.com", email: "contact@pearson.com", address: "London, UK" },
  { name: "McGraw-Hill", website: "https://www.mheducation.com", email: "help@mheducation.com", address: "New York, NY, USA" },
  { name: "MIT Press", website: "https://mitpress.mit.edu", email: "mitpress-orders@mit.edu", address: "Cambridge, MA, USA" },
  { name: "No Starch Press", website: "https://nostarch.com", email: "info@nostarch.com", address: "San Francisco, CA, USA" },
  { name: "Pragmatic Bookshelf", website: "https://pragprog.com", email: "support@pragprog.com", address: "Raleigh, NC, USA" },
  { name: "HarperCollins", website: "https://www.harpercollins.com", email: "feedback@harpercollins.com", address: "New York, NY, USA" },
  { name: "Penguin Random House", website: "https://www.penguinrandomhouse.com", email: "consumerservices@penguinrandomhouse.com", address: "New York, NY, USA" },
  { name: "Springer", website: "https://www.springer.com", email: "customerservice@springer.com", address: "Berlin, Allemagne" },
  { name: "Wiley", website: "https://www.wiley.com", email: "info@wiley.com", address: "Hoboken, NJ, USA" },
  { name: "Oxford University Press", website: "https://global.oup.com", email: "custserv.us@oup.com", address: "Oxford, UK" },
  { name: "Dunod", website: "https://www.dunod.com", email: "infos@dunod.com", address: "Paris, France" }
];

async function seedPublishers() {
  try {
    console.log("⏳ Connexion à MongoDB pour les éditeurs...");
    await dbConnect();

    console.log("🧹 Nettoyage de la collection Publisher...");
    await Publisher.deleteMany({});

    console.log("🌱 Insertion des 15 éditeurs...");
    await Publisher.insertMany(publishersData);

    console.log("✅ Seeding des éditeurs terminé avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors du seeding des éditeurs :", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedPublishers();