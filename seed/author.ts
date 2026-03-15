import "dotenv/config";
import mongoose from "mongoose";
import { Author } from "../lib/models/Author.ts"; // Ajuste le chemin selon ton dossier
import dbConnect from "../lib/mongodb.ts";

const authorsData = [
  { firstName: "Robert", lastName: "Martin", bio: "Aussi connu sous le nom de 'Uncle Bob', auteur de Clean Code.", nationality: "Américain" },
  { firstName: "Martin", lastName: "Fowler", bio: "Expert en architecture logicielle et auteur de Refactoring.", nationality: "Britannique" },
  { firstName: "Isaac", lastName: "Asimov", bio: "Père de la science-fiction moderne et des trois lois de la robotique.", nationality: "Américain" },
  { firstName: "George", lastName: "Orwell", bio: "Auteur de chefs-d'œuvre dystopiques comme 1984.", nationality: "Britannique" },
  { firstName: "Brendan", lastName: "Eich", bio: "Créateur du langage de programmation JavaScript.", nationality: "Américain" },
  { firstName: "Linus", lastName: "Torvalds", bio: "Créateur du noyau Linux et du système Git.", nationality: "Finlando-Américain" },
  { firstName: "Ada", lastName: "Lovelace", bio: "Pionnière de la science informatique.", nationality: "Britannique" },
  { firstName: "Kent", lastName: "Beck", bio: "Créateur du Extreme Programming et du TDD.", nationality: "Américain" },
  { firstName: "Don", lastName: "Norman", bio: "Père de l'UX Design et auteur de The Design of Everyday Things.", nationality: "Américain" },
  { firstName: "Frank", lastName: "Herbert", bio: "Auteur de la célèbre saga de science-fiction Dune.", nationality: "Américain" },
  { firstName: "Alan", lastName: "Turing", bio: "Mathématicien, logicien et père de l'informatique théorique.", nationality: "Britannique" },
  { firstName: "Grace", lastName: "Hopper", bio: "Conceptrice du premier compilateur et pionnière du COBOL.", nationality: "Américain" },
  { firstName: "Steve", lastName: "McConnell", bio: "Auteur de Code Complete, référence en construction logicielle.", nationality: "Américain" },
  { firstName: "Eric", lastName: "Evans", bio: "Inventeur du Domain-Driven Design (DDD).", nationality: "Américain" },
  { firstName: "Margaret", lastName: "Hamilton", bio: "Responsable du logiciel de vol pour le programme Apollo.", nationality: "Américain" }
];

async function seedAuthors() {
  try {
    console.log("⏳ Connexion à MongoDB pour les auteurs...");
    await dbConnect();

    console.log("🧹 Nettoyage de la collection Author...");
    await Author.deleteMany({});

    console.log("🌱 Insertion des 15 auteurs...");
    await Author.insertMany(authorsData);

    console.log("✅ Seeding des auteurs terminé avec succès !");
  } catch (error) {
    console.error("❌ Erreur lors du seeding des auteurs :", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedAuthors();