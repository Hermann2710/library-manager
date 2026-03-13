import * as z from "zod";

export const memberSchema = z.object({
  user: z.string().min(1, "L'utilisateur est requis"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  address: z.string().optional(),
  status: z.enum(["Active", "Inactive", "Banned"]).default("Active"),
  membershipExpiresAt: z.string().or(z.date()), // On accepte les deux car le calendrier envoie une string
});