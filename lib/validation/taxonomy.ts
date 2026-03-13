import * as z from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  description: z.string().optional(),
});

export const genreSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
});