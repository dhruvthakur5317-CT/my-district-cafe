import { NextResponse } from "next/server";
import { globalStore } from "@/lib/store";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get("admin_token");

        if (!adminToken || adminToken.value !== "authorized_session_token") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json({ success: true, messages: globalStore.contactMessages });
    } catch (error: any) {
        console.error("Admin Messages Fetch Error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get("admin_token");

        if (!adminToken || adminToken.value !== "authorized_session_token") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { id, read } = await req.json();
        const messageIndex = globalStore.contactMessages.findIndex((msg: any) => msg.id === id);

        if (messageIndex !== -1) {
            globalStore.contactMessages[messageIndex].read = read;
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Admin Message Update Error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const cookieStore = await cookies();
        const adminToken = cookieStore.get("admin_token");

        if (!adminToken || adminToken.value !== "authorized_session_token") {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(req.url);
        const action = url.searchParams.get("action");
        const id = url.searchParams.get("id");

        if (action === "clear_all") {
            globalStore.contactMessages = [];
        } else if (id) {
            globalStore.contactMessages = globalStore.contactMessages.filter((msg: any) => msg.id !== id);
        } else {
            return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Admin Message Delete Error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
