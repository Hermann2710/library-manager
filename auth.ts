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
import { Member } from "@/lib/models/Member";

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
              image: user.image,
            };
          }
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as any).role || "reader";
        token.id = user.id;
        token.picture = (user as any).image;
      }

      if (trigger === "update" && session) {
        token.name = session.name;
        token.email = session.email;
        token.picture = session.image;
      }

      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.role = token.role as "reader" | "librarian" | "admin";
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.image = token.picture as string;
      }
      return session;
    },
  },
  events: {
    /**
     * Triggered automatically after a new user is created in the database 
     * via an OAuth provider (Google, GitHub, etc.).
     */
    async createUser({ user }) {
      try {
        await dbConnect();

        // Check if a member record already exists (safety check)
        const existingMember = await Member.findOne({ user: user.id });

        if (!existingMember) {
          const memberCount = await Member.countDocuments();
          const memberId = `MEM-${new Date().getFullYear()}-${(memberCount + 1).toString().padStart(4, '0')}`;
          
          const expirationDate = new Date();
          expirationDate.setFullYear(expirationDate.getFullYear() + 1);

          await Member.create({
            user: user.id, // Auth.js provides the generated ID here
            memberId,
            phone: "Non renseigné",
            status: "Active",
            membershipExpiresAt: expirationDate,
          });
          
          console.log(`[AUTH-EVENT] Membership ${memberId} created for ${user.email}`);
        }
      } catch (error) {
        console.error("[AUTH-EVENT] Failed to auto-initialize Member:", error);
      }
    }
  },
  pages: {
    signIn: "/login",
  },
});