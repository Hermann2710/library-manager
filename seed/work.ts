import "dotenv/config";
import mongoose from "mongoose";
import { Author } from "../lib/models/Author.ts";
import { Publisher } from "../lib/models/Publisher.ts";
import { Category, Genre } from "../lib/models/Taxonomy.ts";
import { Work } from "../lib/models/Work.ts";
import dbConnect from "../lib/mongodb.ts";

function cover(isbn: string) {
  return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
}

async function seedWorks() {
  try {
    console.log("Connexion MongoDB - ouvrages");
    await dbConnect();

    const [authors, categories, genres, publishers] = await Promise.all([
      Author.find(),
      Category.find(),
      Genre.find(),
      Publisher.find(),
    ]);

    const getAuthor = (lastName: string) => authors.find((author) => author.lastName === lastName)?._id;
    const getCategory = (name: string) => categories.find((category) => category.name === name)?._id;
    const getGenre = (name: string) => genres.find((genre) => genre.name === name)?._id;
    const getPublisher = (name: string) => publishers.find((publisher) => publisher.name === name)?._id;

    await Work.deleteMany({});

    const worksData = [
      {
        title: "Ville cruelle",
        isbn: "9782708705357",
        language: "Francais",
        publisher: getPublisher("Presence Africaine"),
        category: getCategory("Litterature camerounaise"),
        authors: [getAuthor("Beti")],
        genres: [getGenre("Roman"), getGenre("Classique")],
        coverImage: cover("9782708705357"),
        description: "Un classique camerounais sur les tensions sociales et coloniales.",
      },
      {
        title: "Le vieux negre et la medaille",
        isbn: "9782266027021",
        language: "Francais",
        publisher: getPublisher("Editions CLE"),
        category: getCategory("Litterature camerounaise"),
        authors: [getAuthor("Oyono")],
        genres: [getGenre("Roman"), getGenre("Classique")],
        coverImage: cover("9782266027021"),
        description: "Roman satirique majeur de Ferdinand Oyono.",
      },
      {
        title: "C'est le soleil qui m'a brulee",
        isbn: "9782290305577",
        language: "Francais",
        publisher: getPublisher("Gallimard"),
        category: getCategory("Litterature camerounaise"),
        authors: [getAuthor("Beyala")],
        genres: [getGenre("Roman")],
        coverImage: cover("9782290305577"),
        description: "Portrait social et intime porte par une voix camerounaise forte.",
      },
      {
        title: "Contours du jour qui vient",
        isbn: "9782267018950",
        language: "Francais",
        publisher: getPublisher("Actes Sud"),
        category: getCategory("Litterature camerounaise"),
        authors: [getAuthor("Miano")],
        genres: [getGenre("Roman")],
        coverImage: cover("9782267018950"),
        description: "Roman de Leonora Miano sur la memoire, l'enfance et la reconstruction.",
      },
      {
        title: "Temps de chien",
        isbn: "9782842612894",
        language: "Francais",
        publisher: getPublisher("Presence Africaine"),
        category: getCategory("Litterature camerounaise"),
        authors: [getAuthor("Nganang")],
        genres: [getGenre("Roman")],
        coverImage: cover("9782842612894"),
        description: "Chronique urbaine et sociale d'une ville camerounaise.",
      },
      {
        title: "Things Fall Apart",
        isbn: "9780385474542",
        language: "Anglais",
        publisher: getPublisher("Heinemann"),
        category: getCategory("Litterature africaine"),
        authors: [getAuthor("Achebe")],
        genres: [getGenre("Roman"), getGenre("Classique")],
        coverImage: cover("9780385474542"),
        description: "Classique de Chinua Achebe largement etudie en Afrique.",
      },
      {
        title: "Une si longue lettre",
        isbn: "9782842612895",
        language: "Francais",
        publisher: getPublisher("Presence Africaine"),
        category: getCategory("Litterature africaine"),
        authors: [getAuthor("Ba")],
        genres: [getGenre("Roman"), getGenre("Scolaire")],
        coverImage: cover("9782842612895"),
        description: "Roman epistolaire incontournable de Mariama Ba.",
      },
      {
        title: "Clean Code",
        isbn: "9780132350884",
        language: "Anglais",
        publisher: getPublisher("Pearson Education"),
        category: getCategory("Informatique"),
        authors: [getAuthor("Martin")],
        genres: [getGenre("Technique"), getGenre("Manuel")],
        coverImage: cover("9780132350884"),
        description: "Reference pour les bonnes pratiques de programmation.",
      },
      {
        title: "Refactoring",
        isbn: "9780134757599",
        language: "Anglais",
        publisher: getPublisher("Addison-Wesley"),
        category: getCategory("Informatique"),
        authors: [getAuthor("Fowler")],
        genres: [getGenre("Technique")],
        coverImage: cover("9780134757599"),
        description: "Guide pratique pour ameliorer la structure du code existant.",
      },
      {
        title: "The Lean Startup",
        isbn: "9780307887894",
        language: "Anglais",
        publisher: getPublisher("Currency"),
        category: getCategory("Gestion et entrepreneuriat"),
        authors: [getAuthor("Ries")],
        genres: [getGenre("Guide pratique"), getGenre("Essai")],
        coverImage: cover("9780307887894"),
        description: "Methode pour tester et faire grandir un projet entrepreneurial.",
      },
    ];

    const validWorks = worksData.filter((work) =>
      work.publisher &&
      work.category &&
      work.authors.every(Boolean) &&
      work.genres.every(Boolean)
    );

    await Work.insertMany(validWorks);
    console.log(`${validWorks.length} ouvrages seedes avec succes`);
  } catch (error) {
    console.error("Erreur seeding ouvrages:", error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedWorks();
