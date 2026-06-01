import "dotenv/config";
import mongoose from "mongoose";
import { Item } from "../lib/models/Item.ts";
import { Location } from "../lib/models/Location.ts";
import { Work } from "../lib/models/Work.ts";
import dbConnect from "../lib/mongodb.ts";

async function seedItems() {
  try {
    console.log("Connexion MongoDB - exemplaires");
    await dbConnect();

    const works = await Work.find().sort({ title: 1 });
    const locations = await Location.find().sort({ name: 1 });

    if (works.length === 0 || locations.length === 0) {
      throw new Error("Seed d'abord les ouvrages et les emplacements.");
    }

    await Item.deleteMany({});

    const itemsData = works.flatMap((work, workIndex) => {
      const copiesCount = workIndex % 3 === 0 ? 4 : 3;

      return Array.from({ length: copiesCount }).map((_, copyIndex) => {
        const status = copyIndex === 0 ? "Available" : copyIndex === 1 && workIndex % 4 === 0 ? "Borrowed" : "Available";
        const condition = copyIndex === copiesCount - 1 && workIndex % 5 === 0 ? "Worn" : "Good";
        const location = locations[(workIndex + copyIndex) % locations.length]._id;
        const barcode = `BGC-${String(workIndex + 1).padStart(3, "0")}-${String(copyIndex + 1).padStart(2, "0")}`;

        return {
          work: work._id,
          barcode,
          location,
          status,
          condition,
          notes: condition === "Worn" ? "Verifier la couverture avant prochain pret." : "",
        };
      });
    });

    await Item.insertMany(itemsData);
    console.log(`${itemsData.length} exemplaires seedes avec succes`);
  } catch (error) {
    console.error("Erreur seeding exemplaires:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedItems();
