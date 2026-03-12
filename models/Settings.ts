import mongoose, { Schema, Document } from "mongoose";

export interface ISettings extends Document {
    phone: string;
    email: string;
    address: string;
    services: Array<{
        id: string;
        title: string;
        description: string;
        icon: string;
    }>;
    adminUsername?: string;
    adminPassword?: string;
    upiId?: string;
    priceColor?: number;
    priceBw?: number;
    petrolPrice?: number;
    vehicleAvg?: number;
    cafeLat?: number;
    cafeLon?: number;
    flashMessage?: {
        text: string;
        isActive: boolean;
        activeUntil: string;
    };
}

const SettingsSchema: Schema = new Schema(
    {
        phone: { type: String, default: "+91 98765 43210" },
        email: { type: String, default: "contact@mydistrictcafe.com" },
        address: { type: String, default: "123 Tech Park, Cyber City, Digital State, 100001" },
        services: {
            type: [
                {
                    id: String,
                    title: String,
                    description: String,
                    icon: String
                }
            ],
            default: []
        },
        adminUsername: { type: String, default: "ADMIN" },
        adminPassword: { type: String, default: "admin123" },
        upiId: { type: String, default: "mydistrictcafe@upi" },
        priceColor: { type: Number, default: 10 },
        priceBw: { type: Number, default: 2 },
        petrolPrice: { type: Number, default: 100 },
        vehicleAvg: { type: Number, default: 40 },
        cafeLat: { type: Number, default: 28.6139 },
        cafeLon: { type: Number, default: 77.2090 },
        flashMessage: {
            text: { type: String, default: "" },
            isActive: { type: Boolean, default: false },
            activeUntil: { type: String, default: "" }
        }
    },
    { timestamps: true }
);

const Settings = mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;
