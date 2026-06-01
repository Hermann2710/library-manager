import { requireRole } from "@/lib/rbac";

export default async function LibrarianLayout({ children }: { children: React.ReactNode }) {
  await requireRole(["admin", "librarian"]);

  return children;
}
