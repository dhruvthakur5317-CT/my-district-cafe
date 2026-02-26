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
        }
    },
    { timestamps: true }
);

// We want a single document for settings, so we can always fetch or update the first one.
const Settings = mongoose.models.Settings || mongoose.model<ISettings>("Settings", SettingsSchema);

export default Settings;
