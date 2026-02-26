import { NextResponse } from "next/server";
import { globalStore } from "@/lib/store";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (!globalStore.deletedOrders) globalStore.deletedOrders = [];
        
        const orderIndex = globalStore.deletedOrders.findIndex((o: any) => o._id === id);

        if (orderIndex === -1) {
            return NextResponse.json({ success: false, message: "Order not found in recycle bin" }, { status: 404 });
        }

        // Move the order back to active orders
        const restoredOrder = globalStore.deletedOrders.splice(orderIndex, 1)[0];
        globalStore.orders.push(restoredOrder);

        return NextResponse.json({ success: true, message: "Order restored successfully" });
    } catch (error: any) {
        console.error("Restore order error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
