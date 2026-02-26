import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Settings from "@/models/Settings";
import { razorpayInstance } from "@/utils/razorpay";
import crypto from "crypto";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();

        const {
            userEmail,
            userName,
            userPhone,
            files,
            printOptions,
            deliveryOption,
        } = body;

        // Calculate Price dynamically based on latest settings
        let settings = await Settings.findOne();
        if (!settings) {
            settings = await Settings.create({});
        }

        const perPagePrice =
            printOptions.color === "color"
                ? settings.pricePerPageColor
                : settings.pricePerPageBw;

        const totalPages = files.reduce((acc: number, file: any) => acc + (file.pages || 1), 0);
        const calculatedPrice = totalPages * perPagePrice * printOptions.copies;

        // Create DB Order
        const newOrder = await Order.create({
            userEmail,
            userName,
            userPhone,
            files,
            printOptions,
            deliveryOption,
            price: calculatedPrice,
            status: "Pending",
            paymentStatus: "Pending",
        });

        // Create Razorpay Order
        // Amount is in smallest currency unit (paise for INR)
        const options = {
            amount: calculatedPrice * 100,
            currency: "INR",
            receipt: newOrder._id.toString(),
        };

        const razorpayOrder = await razorpayInstance.orders.create(options);

        // Save Razorpay order ID
        newOrder.razorpayOrderId = razorpayOrder.id;
        await newOrder.save();

        return NextResponse.json(
            {
                success: true,
                orderId: newOrder._id,
                razorpayOrderId: razorpayOrder.id,
                amount: options.amount,
                currency: options.currency,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Checkout API Error:", error);
        return NextResponse.json(
            { error: "Failed to create checkout order", details: error.message },
            { status: 500 }
        );
    }
}
