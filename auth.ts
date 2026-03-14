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
    /**
     * This callback runs after a user signs in. 
     * We use it to ensure every OAuth user gets a library membership automatically.
     */
    async signIn({ user, account }) {
      // We only automate membership for OAuth providers (Google, GitHub, etc.)
      if (account?.provider !== "credentials") {
        try {
          await dbConnect();

          // Check if this person is already registered as a library member
          const existingMember = await Member.findOne({ user: user.id });

          if (!existingMember) {
            // First time here? Let's generate their unique library identity
            const memberCount = await Member.countDocuments();
            const memberId = `MEM-${new Date().getFullYear()}-${(memberCount + 1).toString().padStart(4, '0')}`;
            
            // Setting up a standard 1-year membership duration
            const expirationDate = new Date();
            expirationDate.setFullYear(expirationDate.getFullYear() + 1);

            await Member.create({
              user: user.id,
              memberId,
              phone: "Non renseigné", // Placeholder until they update their profile
              status: "Active",
              membershipExpiresAt: expirationDate,
            });
            
            console.log(`Auto-created membership ${memberId} for user ${user.email}`);
          }
        } catch (error) {
          // We log the error but allow the sign-in to proceed so the user isn't blocked
          console.error("Critical: Failed to auto-initialize Member for OAuth user:", error);
          return true; 
        }
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      // Initial sign-in: transferring database identity to the token
      if (user) {
        token.role = (user as any).role || "reader";
        token.id = user.id;
        token.picture = (user as any).image;
      }

      // Handling real-time updates from the client (e.g., profile settings)
      if (trigger === "update" && session) {
        token.name = session.name;
        token.email = session.email;
        token.picture = session.image;
      }

      return token;
    },

    async session({ session, token }) {
      // Finalizing the session object with our custom JWT data
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
  pages: {
    signIn: "/login",
  },
});