import { NextResponse } from "next/server";
import { globalStore } from "@/lib/store";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { orderStatus, paymentStatus } = await req.json();
        const { id } = await params;

        const orderIndex = globalStore.orders.findIndex((o: any) => o._id === id);

        if (orderIndex === -1) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
        }

        if (orderStatus) globalStore.orders[orderIndex].orderStatus = orderStatus;
        if (paymentStatus) globalStore.orders[orderIndex].paymentStatus = paymentStatus;

        return NextResponse.json({ success: true, order: globalStore.orders[orderIndex] });
    } catch (error: any) {
        console.error("Update order error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const orderIndex = globalStore.orders.findIndex((o: any) => o._id === id);

        if (orderIndex === -1) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
        }

        // Move the order to deletedOrders instead of permanently deleting
        const deletedOrder = globalStore.orders.splice(orderIndex, 1)[0];
        if (!globalStore.deletedOrders) globalStore.deletedOrders = [];
        globalStore.deletedOrders.push(deletedOrder);

        return NextResponse.json({ success: true, message: "Order moved to recycle bin" });
    } catch (error: any) {
        console.error("Delete order error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
