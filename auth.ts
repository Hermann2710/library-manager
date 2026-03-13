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
              role: user.role,
              image: user.image, // Ajout de l'image ici pour la session initiale
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
      if (account?.provider !== "credentials") {
        try {
          await dbConnect();
          const existingMember = await Member.findOne({ user: user.id });

          if (!existingMember) {
            const memberCount = await Member.countDocuments();
            const memberId = `MEM-${new Date().getFullYear()}-${(memberCount + 1).toString().padStart(4, '0')}`;
            
            const expirationDate = new Date();
            expirationDate.setFullYear(expirationDate.getFullYear() + 1);

            await Member.create({
              user: user.id,
              memberId,
              phone: "Non renseigné",
              status: "Active",
              membershipExpiresAt: expirationDate,
            });
          }
        } catch (error) {
          console.error("Erreur OAuth Member Init:", error);
          return true; 
        }
      }
      return true;
    },

    // MODIFICATION ICI : Gestion de l'update
    async jwt({ token, user, trigger, session }) {
      // Lors de la connexion initiale
      if (user) {
        token.role = (user as any).role || "reader";
        token.id = user.id;
        token.picture = (user as any).image;
      }

      // Lors de l'appel à update() depuis le client
      if (trigger === "update" && session) {
        // On met à jour le token avec les nouvelles valeurs envoyées
        token.name = session.name;
        token.email = session.email;
        token.picture = session.image;
        // Si tu as besoin de mettre à jour le rôle via update(), ajoute-le ici
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as "reader" | "librarian" | "admin";
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.image = token.picture as string; // Synchronisation de l'image
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});