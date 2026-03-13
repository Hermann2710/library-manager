import * as z from "zod";

export const publisherSchema = z.object({
  name: z.string().min(2, "Le nom de l'éditeur est requis"),
  address: z.string().optional(),
  // .or(z.literal("")) permet de laisser le champ vide sans erreur de format URL/Email
  website: z.string().url("URL invalide").optional().or(z.literal("")),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
});

export type PublisherFormValues = z.infer<typeof publisherSchema>;