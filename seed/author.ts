import "dotenv/config";
import mongoose from "mongoose";
import { Author } from "../lib/models/Author.ts";
import dbConnect from "../lib/mongodb.ts";

const authorsData = [
  { firstName: "Mongo", lastName: "Beti", bio: "Romancier camerounais majeur, critique des pouvoirs coloniaux et postcoloniaux.", nationality: "Camerounaise" },
  { firstName: "Ferdinand", lastName: "Oyono", bio: "Ecrivain et diplomate camerounais, auteur de classiques de la litterature africaine.", nationality: "Camerounaise" },
  { firstName: "Calixthe", lastName: "Beyala", bio: "Romanciere camerounaise reconnue pour ses portraits sociaux incisifs.", nationality: "Camerounaise" },
  { firstName: "Leonora", lastName: "Miano", bio: "Autrice camerounaise explorant les identites africaines et diasporiques.", nationality: "Camerounaise" },
  { firstName: "Patrice", lastName: "Nganang", bio: "Ecrivain et universitaire camerounais.", nationality: "Camerounaise" },
  { firstName: "Francis", lastName: "Bebey", bio: "Artiste, musicien et ecrivain camerounais.", nationality: "Camerounaise" },
  { firstName: "Werewere", lastName: "Liking", bio: "Ecrivaine, dramaturge et artiste camerounaise.", nationality: "Camerounaise" },
  { firstName: "Chinua", lastName: "Achebe", bio: "Romancier nigerian, figure centrale des lettres africaines.", nationality: "Nigeriane" },
  { firstName: "Mariama", lastName: "Ba", bio: "Romanciere senegalaise, autrice d'une oeuvre majeure sur la condition feminine.", nationality: "Senegalaise" },
  { firstName: "Robert", lastName: "Martin", bio: "Auteur de Clean Code et figure de l'ingenierie logicielle.", nationality: "Americaine" },
  { firstName: "Martin", lastName: "Fowler", bio: "Specialiste de l'architecture logicielle et du refactoring.", nationality: "Britannique" },
  { firstName: "Eric", lastName: "Ries", bio: "Auteur de reference sur le Lean Startup.", nationality: "Americaine" },
];

async function seedAuthors() {
  try {
    console.log("Connexion MongoDB - auteurs");
    await dbConnect();

    await Author.deleteMany({});
    await Author.insertMany(authorsData);

    console.log("Auteurs seedes avec succes");
  } catch (error) {
    console.error("Erreur seeding auteurs:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedAuthors();
