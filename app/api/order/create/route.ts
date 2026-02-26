import { NextResponse } from "next/server";
import { globalStore } from "@/lib/store";

export async function POST(req: Request) {
    try {
        const data = await req.json();

        // 1. Simulate Order IDs
        const fakeOrderId = "order_" + Date.now();
        const fakeDbId = "db_" + Date.now();

        // 2. Save order to memory store
        const newOrder = {
            ...data,
            _id: fakeDbId,
            razorpayOrderId: fakeOrderId,
            paymentStatus: "Pending",
            orderStatus: "Pending",
            createdAt: new Date().toISOString()
        };

        globalStore.orders.push(newOrder);

        return NextResponse.json({
            success: true,
            orderId: fakeOrderId,
            amount: data.totalPrice * 100, // amount in paise
            currency: "INR",
            dbOrderId: fakeDbId,
        });
    } catch (error: any) {
        console.error("Order creation root error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
