import { NextResponse } from "next/server";
import { globalStore } from "@/lib/store";

export async function DELETE() {
    try {
        // Empty the in-memory array of orders
        globalStore.orders = [];

        return NextResponse.json({ success: true, message: "History cleared successfully" });
    } catch (error: any) {
        console.error("Clear orders error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
