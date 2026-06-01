import { auth } from "@/auth";
import { redirect } from "next/navigation";
import type { AppRole } from "@/lib/access-control";

export async function requireRole(allowedRoles: AppRole[]) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (!allowedRoles.includes(session.user.role as AppRole)) {
    redirect("/dashboard");
  }

  return session;
}

export async function assertRole(allowedRoles: AppRole[]) {
  const session = await auth();

  if (!session?.user || !allowedRoles.includes(session.user.role as AppRole)) {
    throw new Error("Acces non autorise");
  }

  return session;
}
