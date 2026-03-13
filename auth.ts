// auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "@/lib/db";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { loginSchema } from "@/lib/validation/auth";
import { Member } from "./lib/models/Member";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client),
  providers: [
    Google,
    GitHub,
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;

          await dbConnect();
          
          const user = await User.findOne({ email });
          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            return {
              id: user._id.toString(),
              name: user.name,
              email: user.email,
              role: user.role, // This value comes from MongoDB
            };
          }
        }

        return null;
      },
    }),
  ],
session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, account }) {
      // Si c'est une connexion OAuth (Google, GitHub)
      if (account?.provider !== "credentials") {
        try {
          await dbConnect();

          // On vérifie si une fiche membre existe déjà pour cet ID utilisateur
          const existingMember = await Member.findOne({ user: user.id });

          if (!existingMember) {
            // Génération du Member ID (ex: MEM-2026-XXXX)
            const memberCount = await Member.countDocuments();
            const memberId = `MEM-${new Date().getFullYear()}-${(memberCount + 1).toString().padStart(4, '0')}`;
            
            // Expiration par défaut : Aujourd'hui + 1 an
            const expirationDate = new Date();
            expirationDate.setFullYear(expirationDate.getFullYear() + 1);

            await Member.create({
              user: user.id,
              memberId,
              phone: "Non renseigné",
              status: "Active",
              membershipExpiresAt: expirationDate,
            });
            console.log(`Fiche membre créée pour l'utilisateur OAuth: ${user.email}`);
          }
        } catch (error) {
          console.error("Erreur lors de la création auto du membre (OAuth):", error);
          // On laisse quand même l'utilisateur se connecter, même si la fiche membre échoue
          return true; 
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role || "reader"; // Sécurité si le rôle est absent
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.role) {
        session.user.role = token.role as "reader" | "librarian" | "admin";
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});