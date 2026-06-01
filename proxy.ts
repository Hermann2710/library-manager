import { auth as proxy } from "@/auth";
import { canAccessPath } from "@/lib/access-control";
import { NextResponse } from "next/server";

export default proxy((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;
  const isDashboardRoute = nextUrl.pathname.startsWith("/dashboard");
  const isAuthRoute = ["/login", "/register"].includes(nextUrl.pathname);

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
    return NextResponse.next();
  }

  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (isDashboardRoute && !canAccessPath(nextUrl.pathname, userRole)) {
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
