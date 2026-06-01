import * as z from "zod";

export type ProfileUser = {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
};

export const profileSchema = z.object({
  name: z.string().min(2, "Le nom est trop court"),
  email: z.string().email("Email invalide"),
  image: z.string().optional(),
  phone: z.string().trim().max(30, "Le contact est trop long").optional(),
  address: z.string().trim().max(180, "L'adresse est trop longue").optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export function formatDate(value?: string) {
  if (!value) return "Non renseigne";
  return new Intl.DateTimeFormat("fr-CM", { dateStyle: "medium" }).format(new Date(value));
}
