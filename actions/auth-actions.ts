"use server";

import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import { Member } from "@/lib/models/Member";
import { registerSchema } from "@/lib/validation/auth";
import { z } from "zod";
// Import de l'action de notification
import { createNotification } from "@/actions/notification-actions";

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
    const memberCount = await Member.countDocuments();
    const memberId = `MEM-${new Date().getFullYear()}-${(memberCount + 1).toString().padStart(4, '0')}`;
    
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    const newMember = await Member.create({
      user: newUser._id,
      memberId,
      phone: "Non renseigné",
      status: "Active",
      membershipExpiresAt: expirationDate,
    });

    // --- SYSTÈME DE NOTIFICATIONS ---

    // A. Notification de Bienvenue pour le Lecteur
    await createNotification({
      recipient: newUser._id.toString(),
      title: "👋 Bienvenue à la Bibliothèque !",
      message: `Votre compte a été créé avec succès. Votre ID membre est ${memberId}. N'oubliez pas de compléter votre profil.`,
      type: "system",
      priority: "medium",
      link: "/dashboard/profile"
    });

    // B. Notification pour les Bibliothécaires/Admins
    await createNotification({
      recipientRole: "librarian",
      title: "👤 Nouveau membre inscrit",
      message: `${name} vient de rejoindre la bibliothèque (ID: ${memberId}).`,
      type: "system",
      priority: "low",
      link: `/dashboard/librarian/members/${newMember._id}`
    });

    return { success: "Compte créé et adhésion activée ! Vous pouvez vous connecter." };
  } catch (error) {
    console.error("Register Error:", error);
    return { error: "Erreur lors de l'inscription." };
  }
}