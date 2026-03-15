import "dotenv/config";
import mongoose from "mongoose";
import { Work } from "../lib/models/Work.ts";
import { Author } from "../lib/models/Author.ts";
import { Category, Genre } from "../lib/models/Taxonomy.ts";
import { Publisher } from "../lib/models/Publisher.ts";
import dbConnect from "../lib/mongodb.ts";

async function seedWorks() {
  try {
    console.log("⏳ Connexion à MongoDB pour les ouvrages...");
    await dbConnect();

    const authors = await Author.find();
    const categories = await Category.find();
    const genres = await Genre.find();
    const publishers = await Publisher.find();

    console.log("🧹 Nettoyage de la collection Work...");
    await Work.deleteMany({});

    // Helper pour trouver un ID rapidement
    const getAuth = (name: string) => authors.find(a => a.lastName === name)?._id;
    const getCat = (name: string) => categories.find(c => c.name === name)?._id;
    const getGen = (name: string) => genres.find(g => g.name === name)?._id;
    const getPub = (name: string) => publishers.find(p => p.name === name)?._id;

    const worksData = [
      // --- DÉVELOPPEMENT WEB ---
      { title: "Clean Code", isbn: "9780132350884", language: "English", publisher: getPub("Pearson Education"), category: getCat("Développement Web"), authors: [getAuth("Martin")], genres: [getGen("Technique")] },
      { title: "You Don't Know JS", isbn: "9781491904244", language: "English", publisher: getPub("O'Reilly Media"), category: getCat("Développement Web"), authors: [getAuth("Eich")], genres: [getGen("Guide")] },
      { title: "Refactoring", isbn: "9780134757599", language: "English", publisher: getPub("Addison-Wesley"), category: getCat("Développement Web"), authors: [getAuth("Fowler")], genres: [getGen("Technique")] },
      
      // --- IA & DATA ---
      { title: "Deep Learning", isbn: "9780262035613", language: "English", publisher: getPub("MIT Press"), category: getCat("Intelligence Artificielle"), authors: [getAuth("Turing")], genres: [getGen("Académique")] },
      { title: "Human Compatible", isbn: "9780525558613", language: "English", publisher: getPub("Penguin Random House"), category: getCat("Intelligence Artificielle"), authors: [getAuth("Turing")], genres: [getGen("Essai")] },

      // --- SCIENCE-FICTION ---
      { title: "Dune", isbn: "9780441172719", language: "French", publisher: getPub("Penguin Random House"), category: getCat("Science-Fiction"), authors: [getAuth("Herbert")], genres: [getGen("Roman"), getGen("Fantaisie")] },
      { title: "1984", isbn: "9780451524935", language: "French", publisher: getPub("HarperCollins"), category: getCat("Science-Fiction"), authors: [getAuth("Orwell")], genres: [getGen("Dystopie")] },
      { title: "Foundation", isbn: "9780553293357", language: "English", publisher: getPub("HarperCollins"), category: getCat("Science-Fiction"), authors: [getAuth("Asimov")], genres: [getGen("Roman")] },
      { title: "I, Robot", isbn: "9780553382563", language: "English", publisher: getPub("Spectra"), category: getCat("Science-Fiction"), authors: [getAuth("Asimov")], genres: [getGen("Nouvelles")] },

      // --- DESIGN & UX ---
      { title: "The Design of Everyday Things", isbn: "9780465050659", language: "English", publisher: getPub("Basic Books"), category: getCat("Design & UX/UI"), authors: [getAuth("Norman")], genres: [getGen("Manuel")] },
      { title: "Don't Make Me Think", isbn: "9780321965516", language: "English", publisher: getPub("Pearson Education"), category: getCat("Design & UX/UI"), authors: [getAuth("Norman")], genres: [getGen("Guide")] },

      // --- GESTION & AGILE ---
      { title: "The Phoenix Project", isbn: "9780988262591", language: "English", publisher: getPub("IT Revolution Press"), category: getCat("Management Agile"), authors: [getAuth("Beck")], genres: [getGen("Professionnel")] },
      { title: "Extreme Programming Explained", isbn: "9780321278654", language: "English", publisher: getPub("Addison-Wesley"), category: getCat("Management Agile"), authors: [getAuth("Beck")], genres: [getGen("Technique")] },
      { title: "Domain-Driven Design", isbn: "9780321125217", language: "English", publisher: getPub("Addison-Wesley"), category: getCat("Architecture"), authors: [getAuth("Evans")], genres: [getGen("Technique")] },

      // --- HISTOIRE & BIO ---
      { title: "Steve Jobs", isbn: "9781451648539", language: "French", publisher: getPub("Simon & Schuster"), category: getCat("Histoire des Tech"), authors: [getAuth("Isaacson")], genres: [getGen("Biographie")] },
      { title: "Turing's Cathedral", isbn: "9781400075997", language: "English", publisher: getPub("Pantheon"), category: getCat("Histoire des Tech"), authors: [getAuth("Turing")], genres: [getGen("Historique")] },

      // --- SYSTÈME & BAS NIVEAU ---
      { title: "The C Programming Language", isbn: "9780131103627", language: "English", publisher: getPub("Pearson Education"), category: getCat("Langages de Bas Niveau"), authors: [getAuth("Ritchie")], genres: [getGen("Manuel")] },
      { title: "Rust Programming", isbn: "9781491927281", language: "English", publisher: getPub("O'Reilly Media"), category: getCat("Langages de Bas Niveau"), authors: [getAuth("Torvalds")], genres: [getGen("Technique")] },

      // --- SÉCURITÉ ---
      { title: "The Art of Deception", isbn: "9780471237129", language: "English", publisher: getPub("Wiley"), category: getCat("Cyber-sécurité"), authors: [getAuth("Mitnick")], genres: [getGen("Technique")] },
      { title: "Ghost in the Wires", isbn: "9780316037723", language: "English", publisher: getPub("Little, Brown"), category: getCat("Cyber-sécurité"), authors: [getAuth("Mitnick")], genres: [getGen("Biographie")] },
      
      // --- DIVERS ---
      { title: "The Pragmatic Programmer", isbn: "9780135957059", language: "English", publisher: getPub("Pragmatic Bookshelf"), category: getCat("Développement Web"), authors: [getAuth("Hunt")], genres: [getGen("Professionnel")] },
      { title: "Mythical Man-Month", isbn: "9780201835953", language: "English", publisher: getPub("Addison-Wesley"), category: getCat("Management Agile"), authors: [getAuth("Brooks")], genres: [getGen("Essai")] }
    ];

    console.log(`🌱 Insertion de ${worksData.length} ouvrages...`);
    // On filtre pour éviter d'insérer des documents avec des IDs undefined (si un auteur/cat n'est pas trouvé)
    const validWorks = worksData.filter(w => w.publisher && w.category && w.authors[0]);
    await Work.insertMany(validWorks);

    console.log("✅ Seeding des ouvrages terminé !");
  } catch (error) {
    console.error("❌ Erreur :", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedWorks();