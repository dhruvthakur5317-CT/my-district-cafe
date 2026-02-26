import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
    customerName: string;
    phoneNumber: string;
    email: string;
    fileUrl: string;
    fileName: string;
    fileType: string;
    printType: "B&W" | "Color";
    paperSize: "A4" | "A3" | "Legal";
    numCopies: number;
    totalPages: number;
    customInstructions?: string;
    deliveryOption: "Pickup" | "Home Delivery";
    totalPrice: number;
    paymentStatus: "Pending" | "Paid" | "Failed";
    orderStatus: "Pending" | "Printing" | "Ready" | "Delivered";
    razorpayOrderId?: string;
    razorpayPaymentId?: string;
    createdAt: Date;
}

const OrderSchema: Schema = new Schema({
    customerName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
    fileType: { type: String, required: true },
    printType: { type: String, enum: ["B&W", "Color"], required: true },
    paperSize: { type: String, enum: ["A4", "A3", "Legal"], required: true },
    numCopies: { type: Number, required: true, default: 1 },
    totalPages: { type: Number, required: true },
    customInstructions: { type: String },
    deliveryOption: { type: String, enum: ["Pickup", "Home Delivery"], required: true },
    totalPrice: { type: Number, required: true },
    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed"], default: "Pending" },
    orderStatus: { type: String, enum: ["Pending", "Printing", "Ready", "Delivered"], default: "Pending" },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
