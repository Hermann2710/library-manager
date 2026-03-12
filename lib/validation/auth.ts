import { z } from "zod";

/**
 * Schema for user registration.
 */
export const registerSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

/**
 * Schema for user login.
 */
export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

/**
 * Type inferred from the registration schema.
 */
export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Type inferred from the login schema.
 */
export type LoginInput = z.infer<typeof loginSchema>;