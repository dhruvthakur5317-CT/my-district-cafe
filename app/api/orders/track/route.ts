import { NextResponse } from "next/server";
import { globalStore } from "@/lib/store";

export async function POST(req: Request) {
    try {
        const { query } = await req.json();

        if (!query) {
            return NextResponse.json({ success: false, message: "Query required" }, { status: 400 });
        }

        const sqLower = query.toLowerCase().trim();

        // Find orders that match the phone number OR the exact DB Order ID
        const matchedOrders = globalStore.orders.filter((o: any) =>
            o.phoneNumber.includes(sqLower) ||
            o._id.toLowerCase() === sqLower ||
            o._id.toLowerCase().slice(-6) === sqLower // Allow matching the 6-character short ID as well
        ).sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        return NextResponse.json({ success: true, orders: matchedOrders });
    } catch (error: any) {
        console.error("Track orders error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
