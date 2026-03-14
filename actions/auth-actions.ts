"use server";

import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import { Member } from "@/lib/models/Member";
import { registerSchema } from "@/lib/validation/auth";
import { z } from "zod";
import { createNotification } from "@/actions/notification-actions";

/**
 * Handles the registration flow for new users.
 * This includes identity creation, member card generation, and initial notifications.
 */
export async function registerAction(values: z.infer<typeof registerSchema>) {
  // Validate incoming data against our Zod schema before hitting the DB
  const validatedFields = registerSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Données invalides" };

  const { email, password, name } = validatedFields.data;

  try {
    await dbConnect();
    
    // Check if the user is trying to register an existing email
    const userExists = await User.findOne({ email });
    if (userExists) return { error: "Cet email est déjà utilisé." };

    // Standard security: Hash the password with a salt round of 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // 1. Core User Creation (Identity)
    // New users are assigned the 'reader' role by default for safety
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "reader",
    });

    // 2. Automatic Library Membership Initialization
    // We generate a unique ID based on the current year and the total member count
    const memberCount = await Member.countDocuments();
    const memberId = `MEM-${new Date().getFullYear()}-${(memberCount + 1).toString().padStart(4, '0')}`;
    
    // Set an initial membership lifespan of exactly one year
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);

    const newMember = await Member.create({
      user: newUser._id,
      memberId,
      phone: "Non renseigné",
      status: "Active",
      membershipExpiresAt: expirationDate,
    });

    // --- NOTIFICATION SYSTEM DISPATCH ---

    // A. Welcome Notification (Target: The new Reader)
    // Helps the user feel oriented and provides their new Member ID immediately
    await createNotification({
      recipient: newUser._id.toString(),
      title: "👋 Bienvenue à la Bibliothèque !",
      message: `Votre compte a été créé avec succès. Votre ID membre est ${memberId}. N'oubliez pas de compléter votre profil.`,
      type: "system",
      priority: "medium",
      link: "/dashboard/profile"
    });

    // B. Internal Alert (Target: Staff/Admins)
    // Keeps the team informed about new arrivals in real-time
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
    // Log the error for server-side debugging but keep client feedback generic
    console.error("Register Error:", error);
    return { error: "Erreur lors de l'inscription." };
  }
}