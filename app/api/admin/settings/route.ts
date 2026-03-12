import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Settings from "@/models/Settings";
import { globalStore } from "@/lib/store";

export async function GET(req: NextRequest) {
    try {
        await connectDB();

        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }

        return NextResponse.json({ success: true, settings }, { status: 200 });
    } catch (error: any) {
        console.error("Admin Settings GET Error (falling back to defaults):", error.message);
        // Fall back to in-memory defaults so the UI doesn't crash
        return NextResponse.json({ success: true, settings: globalStore.settings, fallback: true }, { status: 200 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        const {
            phone,
            email,
            address,
            services,
            upiId,
            priceColor,
            priceBw,
            petrolPrice,
            vehicleAvg,
            cafeLat,
            cafeLon,
            flashMessage,
            adminUsername,
            adminPassword,
        } = body;

        const updatePayload: any = {
            phone,
            email,
            address,
            services,
            upiId,
            priceColor,
            priceBw,
            petrolPrice,
            vehicleAvg,
            cafeLat,
            cafeLon,
        };

        if (flashMessage !== undefined) updatePayload.flashMessage = flashMessage;
        if (adminUsername) updatePayload.adminUsername = adminUsername;
        if (adminPassword) updatePayload.adminPassword = adminPassword;

        const updatedSettings = await Settings.findOneAndUpdate(
            {},
            updatePayload,
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, settings: updatedSettings }, { status: 200 });
    } catch (error: any) {
        console.error("Admin Settings PUT Error:", error);
        return NextResponse.json({ error: "Failed to update settings", details: error.message }, { status: 500 });
    }
}
