import { NextResponse } from "next/server";
import { globalStore } from "@/lib/store";

export async function POST(req: Request) {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, dbOrderId, upiName } = await req.json();

        // In a real app we'd verify the crypto signature here
        // For demo purposes, we automatically verify it since the payment is simulated

        const orderIndex = globalStore.orders.findIndex((o: any) => o._id === dbOrderId);
        if (orderIndex !== -1) {
            const isCash = razorpay_payment_id === "CASH_COUNTER";
            globalStore.orders[orderIndex].paymentStatus = isCash ? "Pending Cash" : "Paid";
            globalStore.orders[orderIndex].razorpayPaymentId = razorpay_payment_id;
            if (upiName) globalStore.orders[orderIndex].upiName = upiName;
            globalStore.orders[orderIndex].orderStatus = "Printing"; // Move to printing queue automatically
        }

        return NextResponse.json({ success: true, message: "Payment verified successfully" });
    } catch (error: any) {
        console.error("Verification error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
