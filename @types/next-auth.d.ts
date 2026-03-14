import { DefaultSession } from "next-auth";

/**
 * Module Augmentation for Next-Auth.
 * This allows us to extend the default types with our custom 'role' property,
 * enabling full TypeScript support and autocompletion throughout the app.
 */
declare module "next-auth" {
  /**
   * Extends the built-in User interface to include the role from the database.
   */
  interface User {
    role?: "reader" | "librarian" | "admin";
  }

  /**
   * Extends the Session interface so 'session.user.role' is accessible 
   * in Client Components (via useSession) and Server-side logic (via auth()).
   */
  interface Session {
    user: {
      role?: "reader" | "librarian" | "admin";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  /**
   * Extends the JWT interface to ensure the role is persisted 
   * within the token during the 'jwt' callback.
   */
  interface JWT {
    role?: "reader" | "librarian" | "admin";
  }
}