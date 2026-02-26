import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/utils/cloudinary";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Identify resource type
        let resourceType: "auto" | "image" | "video" | "raw" = "auto";
        if (file.type.startsWith("image/")) {
            resourceType = "image";
        }

        const result = await uploadToCloudinary(buffer, "mydistrictcafe_prints", resourceType);

        return NextResponse.json(
            { success: true, url: result.secure_url, public_id: result.public_id, name: file.name },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Upload API error:", error);
        return NextResponse.json(
            { error: "File upload failed", details: error.message },
            { status: 500 }
        );
    }
}
