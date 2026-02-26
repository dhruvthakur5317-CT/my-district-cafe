import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = body;

        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) throw new Error("Razorpay secret not found in env");

        const generated_signature = crypto
            .createHmac("sha256", secret)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest("hex");

        if (generated_signature !== razorpay_signature) {
            return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
        }

        // Payment is verified
        // Find the order and update status to Paid
        const order = await Order.findOneAndUpdate(
            { razorpayOrderId: razorpay_order_id },
            {
                paymentStatus: "Paid",
                razorpayPaymentId: razorpay_payment_id,
            },
            { new: true }
        );

        if (!order) {
            return NextResponse.json({ error: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Payment verified successfully",
            order,
        }, { status: 200 });
    } catch (error: any) {
        console.error("Payment Verification Error:", error);
        return NextResponse.json(
            { error: "Payment verification failed", details: error.message },
            { status: 500 }
        );
    }
}
