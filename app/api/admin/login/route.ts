import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { globalStore } from "@/lib/store";

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        const ADMIN_USERNAME = globalStore.settings?.adminUsername || "ADMIN";
        const ADMIN_PASSWORD = globalStore.settings?.adminPassword || "admin123";

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            const cookieStore = await cookies();
            cookieStore.set("admin_token", "authorized_session_token", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24, // 24 hours
                path: "/",
            });

            return NextResponse.json({ success: true, message: "Login successful" });
        } else {
            return NextResponse.json(
                { success: false, message: "Invalid credentials" },
                { status: 401 }
            );
        }
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
