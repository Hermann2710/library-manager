// app/actions/auth-actions.ts
"use server";

import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import { registerSchema } from "@/lib/validation/auth";
import { z } from "zod";

export async function registerAction(values: z.infer<typeof registerSchema>) {
  const validatedFields = registerSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Données invalides" };

  const { email, password, name } = validatedFields.data;

  try {
    await dbConnect();
    const userExists = await User.findOne({ email });

    if (userExists) return { error: "Cet email est déjà utilisé." };

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "reader",
    });

    return { success: "Compte créé ! Vous pouvez vous connecter." };
  } catch (error) {
    return { error: "Erreur lors de l'inscription." };
  }
}