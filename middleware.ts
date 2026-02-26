import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // We only care about /admin routes
    if (!path.startsWith("/admin")) {
        return NextResponse.next();
    }

    const token = request.cookies.get("admin_token")?.value;

    // If trying to access login page while already logged in
    if (path === "/admin/login") {
        if (token) {
            return NextResponse.redirect(new URL("/admin/dashboard", request.url));
        }
        return NextResponse.next();
    }

    // Protect all other /admin routes (dashboard, settings, etc)
    if (!token) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
