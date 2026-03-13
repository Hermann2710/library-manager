import * as z from "zod";

export const itemSchema = z.object({
  work: z.string().min(1, "L'œuvre est requise"),
  barcode: z.string().min(3, "Le code-barres est requis"),
  location: z.string().min(1, "L'emplacement est requis"),
  status: z.enum(["Available", "Borrowed", "Lost", "Maintenance"]),
  condition: z.enum(["New", "Good", "Worn", "Damaged"]),
  notes: z.string().optional(),
});