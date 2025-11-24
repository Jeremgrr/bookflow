import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export function middleware(req: Request) {
  const url = new URL(req.url);

  if (url.pathname.startsWith("/dashboard")) {
    const token = req.headers
      .get("cookie")
      ?.split("; ")
      ?.find((c) => c.startsWith("auth_token="))
      ?.split("=")[1];

    if (!token || !verifyToken(token)) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return NextResponse.next();
}

// Apply only to /dashboard routes
export const config = {
  matcher: ["/dashboard/:path*"],
};
