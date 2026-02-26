import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    try {
        const cookieStore = await cookies();

        // Securely delete the httpOnly cookie from the server side
        cookieStore.delete("admin_token");

        return NextResponse.json({ success: true, message: "Logged out successfully" });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
