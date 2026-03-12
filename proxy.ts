// middleware.ts (ou ton fichier proxy de middleware)
import { auth as proxy } from "@/auth";
import { NextResponse } from "next/server";

export default proxy((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  // Définition des zones d'accès
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isLibrarianRoute = nextUrl.pathname.startsWith("/librarian");
  const isAuthRoute = ["/login", "/register"].includes(nextUrl.pathname);

  /**
   * 1. Handling Authentication Pages
   * If the user is already logged in, we redirect them away from login/register.
   */
  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
    return NextResponse.next();
  }

  /**
   * 2. Admin Protection (Strict)
   * Only 'admin' can access /admin/...
   */
  if (isAdminRoute && userRole !== "admin") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  /**
   * 3. Librarian Protection
   * Both 'admin' and 'librarian' have access to librarian tools.
   */
  if (isLibrarianRoute) {
    const hasAccess = userRole === "admin" || userRole === "librarian";
    if (!hasAccess) {
      return NextResponse.redirect(new URL("/", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  /**
   * Standard Next.js matcher to exclude static assets and API routes 
   * from the middleware execution.
   */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};