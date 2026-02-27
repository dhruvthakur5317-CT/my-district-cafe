import { NextResponse } from "next/server";
import { globalStore } from "@/lib/store";

export async function POST(req: Request) {
    try {
        const body = await req.json();

        if (!body.name || !body.email || !body.message) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        const newMessage = {
            id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            name: body.name,
            email: body.email,
            message: body.message,
            createdAt: new Date().toISOString(),
            read: false
        };

        globalStore.contactMessages.unshift(newMessage);

        return NextResponse.json({ success: true, message: "Contact message sent successfully" });
    } catch (error: any) {
        console.error("Contact API Error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
