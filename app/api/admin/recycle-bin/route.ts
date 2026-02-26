import { NextResponse } from "next/server";
import { globalStore } from "@/lib/store";

export async function GET() {
    try {
        if (!globalStore.deletedOrders) globalStore.deletedOrders = [];
        const orders = [...globalStore.deletedOrders].sort(
            (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        return NextResponse.json({ success: true, orders });
    } catch (error: any) {
        console.error("Fetch deleted orders error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE() {
    try {
        globalStore.deletedOrders = [];
        return NextResponse.json({ success: true, message: "Recycle bin cleared" });
    } catch (error: any) {
        console.error("Clear recycle bin error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
