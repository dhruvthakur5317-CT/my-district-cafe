import { NextResponse } from "next/server";
import { globalStore } from "@/lib/store";

export async function GET() {
  try {
    return NextResponse.json({ success: true, settings: globalStore.settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    globalStore.settings = { ...globalStore.settings, ...body };
    return NextResponse.json({ success: true, settings: globalStore.settings });
  } catch (error: any) {
    console.error("Settings POST Error", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
