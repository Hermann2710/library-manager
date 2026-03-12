import { z } from "zod";

export const contactSchema = z.object({
  firstName: z.string().min(2, "Le prénom est requis"),
  lastName: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  message: z.string().min(10, "Le message doit faire au moins 10 caractères"),
});

export type ContactInput = z.infer<typeof contactSchema>;