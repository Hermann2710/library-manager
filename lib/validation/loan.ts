import * as z from "zod";

export const loanSchema = z.object({
  memberId: z.string().min(1, "Veuillez sélectionner un membre"),
  itemId: z.string().min(1, "Veuillez scanner ou sélectionner un exemplaire"),
  dueDate: z.string().min(1, "La date de retour est requise"),
  notes: z.string().optional(),
});