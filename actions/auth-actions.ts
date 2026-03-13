"use server";

import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import { Member } from "@/lib/models/Member"; // Import du modèle Member
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

    // 1. Création de l'utilisateur
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "reader",
    });

    // 2. Création automatique de la fiche membre
    // On génère un ID membre (ex: MEM-2026-XXXX)
    const memberCount = await Member.countDocuments();
    const memberId = `MEM-${new Date().getFullYear()}-${(memberCount + 1).toString().padStart(4, '0')}`;
    
    // Expiration par défaut : Aujourd'hui + 1 an
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    await Member.create({
      user: newUser._id,
      memberId,
      phone: "Non renseigné", // On pourra le modifier plus tard dans le profil
      status: "Active",
      membershipExpiresAt: expirationDate,
    });

    return { success: "Compte créé et adhésion activée ! Vous pouvez vous connecter." };
  } catch (error) {
    console.error("Register Error:", error);
    return { error: "Erreur lors de l'inscription." };
  }
}