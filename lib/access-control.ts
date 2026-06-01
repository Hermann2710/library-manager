export const ROLES = ["reader", "librarian", "admin"] as const;

export type AppRole = (typeof ROLES)[number];

const ROLE_RANK: Record<AppRole, number> = {
  reader: 0,
  librarian: 1,
  admin: 2,
};

export const ROUTE_ACCESS: Array<{
  prefix: string;
  roles: AppRole[];
}> = [
  { prefix: "/dashboard/admin", roles: ["admin"] },
  { prefix: "/dashboard/librarian", roles: ["librarian", "admin"] },
  { prefix: "/dashboard", roles: ["reader", "librarian", "admin"] },
];

export function isRole(value: unknown): value is AppRole {
  return typeof value === "string" && ROLES.includes(value as AppRole);
}

export function canAccessPath(pathname: string, role?: string | null) {
  if (!isRole(role)) return false;

  const rule = ROUTE_ACCESS.find(({ prefix }) => pathname.startsWith(prefix));
  return rule ? rule.roles.includes(role) : true;
}

export function hasAtLeastRole(role: string | null | undefined, minimumRole: AppRole) {
  return isRole(role) && ROLE_RANK[role] >= ROLE_RANK[minimumRole];
}
