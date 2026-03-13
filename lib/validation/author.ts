import * as z from "zod";

export const authorSchema = z.object({
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  bio: z.string().optional(),
  nationality: z.string().optional(),
  birthDate: z.coerce.date().optional(),
  deathDate: z.coerce.date().optional(),
});