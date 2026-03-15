import "dotenv/config";
import mongoose from "mongoose";
import { Item } from "../lib/models/Item.ts";
import { Work } from "../lib/models/Work.ts";
import { Location } from "../lib/models/Location.ts";
import dbConnect from "../lib/mongodb.ts";

async function seedItems() {
  try {
    console.log("⏳ Connexion à MongoDB pour les exemplaires (Items)...");
    await dbConnect();

    // Récupération des données parentes
    const works = await Work.find();
    const locations = await Location.find();

    if (works.length === 0 || locations.length === 0) {
      throw new Error("❌ Erreur : Tu dois d'abord seeder les Works et les Locations !");
    }

    console.log("🧹 Nettoyage de la collection Item...");
    await Item.deleteMany({});

    const itemsData = [];
    let barcodeCounter = 1000;

    // Statuts et conditions pour la distribution aléatoire
    const statuses = ["Available", "Borrowed", "Lost", "Maintenance"];
    const conditions = ["New", "Good", "Worn", "Damaged"];

    console.log(`🌱 Génération des exemplaires pour ${works.length} ouvrages...`);

    for (const work of works) {
      // Générer entre 2 et 5 exemplaires par ouvrage pour avoir une base solide
      const copiesCount = Math.floor(Math.random() * 4) + 2;

      for (let i = 0; i < copiesCount; i++) {
        barcodeCounter++;
        
        // Distribution semi-aléatoire pour le réalisme
        const randomStatus = Math.random() > 0.8 ? statuses[Math.floor(Math.random() * statuses.length)] : "Available";
        const randomCondition = Math.random() > 0.7 ? conditions[Math.floor(Math.random() * conditions.length)] : "Good";
        const randomLocation = locations[Math.floor(Math.random() * locations.length)]._id;

        itemsData.push({
          work: work._id,
          barcode: `BC-${barcodeCounter}`,
          location: randomLocation,
          status: randomStatus,
          condition: randomCondition,
          notes: randomCondition === "Damaged" ? "Nécessite une réparation urgente." : ""
        });
      }
    }

    console.log(`📦 Insertion de ${itemsData.length} exemplaires physiques...`);
    await Item.insertMany(itemsData);

    console.log("✅ Seeding des exemplaires (Items) terminé avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors du seeding des items :", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedItems();