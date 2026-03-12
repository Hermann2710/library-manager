import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: "reader" | "librarian" | "admin";
  }
  interface Session {
    user: {
      role?: "reader" | "librarian" | "admin";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "reader" | "librarian" | "admin";
  }
}