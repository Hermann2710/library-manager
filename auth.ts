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
    async jwt({ token, user }) {
      /**
       * When the user first logs in, we attach the role to the JWT token.
       * We use a type cast to ensure it matches our defined union type.
       */
      if (user) {
        token.role = (user as any).role as "reader" | "librarian" | "admin";
      }
      return token;
    },
    async session({ session, token }) {
      /**
       * We transfer the role from the token to the session object.
       * This makes the role available in useSession() and server-side auth().
       */
      if (token?.role) {
        session.user.role = token.role as "reader" | "librarian" | "admin";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});