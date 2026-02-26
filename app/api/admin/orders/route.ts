import { NextResponse } from "next/server";
import { globalStore } from "@/lib/store";

export async function GET() {
    try {
        const orders = [...globalStore.orders].sort(
            (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        return NextResponse.json({ success: true, orders });
    } catch (error: any) {
        console.error("Fetch orders error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
