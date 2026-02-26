import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Settings from "@/models/Settings";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        let settings = await Settings.findOne();
        if (!settings) {
            // Create default if none exist
            settings = await Settings.create({});
        }

        return NextResponse.json({ success: true, settings }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        const { contactNumber, instagramHandle, pricePerPageBw, pricePerPageColor } = body;

        const updatedSettings = await Settings.findOneAndUpdate(
            {}, // Match the first document
            { contactNumber, instagramHandle, pricePerPageBw, pricePerPageColor },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, settings: updatedSettings }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
    }
}
