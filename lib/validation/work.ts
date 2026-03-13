import * as z from "zod";

export const workSchema = z.object({
  title: z.string().min(2, "Le titre est requis"),
  description: z.string().optional(),
  isbn: z.string().optional().or(z.literal("")),
  language: z.string().min(2, "La langue est requise"),
  publishDate: z.coerce.date().optional(),
  publisher: z.string().min(1, "L'éditeur est requis"),
  category: z.string().min(1, "La catégorie est requise"),
  genres: z.array(z.string()).min(1, "Au moins un genre est requis"),
  authors: z.array(z.string()).min(1, "Au moins un auteur est requis"),
  coverImage: z.string().optional(),
});