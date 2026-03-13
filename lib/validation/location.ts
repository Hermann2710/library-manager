import * as z from "zod";

export const locationSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  description: z.string().optional().or(z.literal("")),
});