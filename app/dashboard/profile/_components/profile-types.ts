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
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export function formatDate(value?: string) {
  if (!value) return "Non renseigne";
  return new Intl.DateTimeFormat("fr-CM", { dateStyle: "medium" }).format(new Date(value));
}
