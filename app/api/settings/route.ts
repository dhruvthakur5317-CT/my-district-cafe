import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Settings from "@/models/Settings";
import { globalStore } from "@/lib/store";

export async function GET() {
    try {
        await connectDB();
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }
        return NextResponse.json({ success: true, settings });
    } catch (error: any) {
        console.error("Public Settings GET falling back to defaults:", error.message);
        // Fall back to in-memory defaults so the site never crashes
        return NextResponse.json({ success: true, settings: globalStore.settings, fallback: true });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const updatedSettings = await Settings.findOneAndUpdate(
            {},
            body,
            { new: true, upsert: true }
        );
        // Also keep in-memory in sync
        globalStore.settings = { ...globalStore.settings, ...body };
        return NextResponse.json({ success: true, settings: updatedSettings });
    } catch (error: any) {
        console.error("Settings POST Error", error.message);
        // Fallback: save to memory only
        const body = await req.json().catch(() => ({}));
        globalStore.settings = { ...globalStore.settings, ...body };
        return NextResponse.json({ success: true, settings: globalStore.settings, fallback: true });
    }
}
