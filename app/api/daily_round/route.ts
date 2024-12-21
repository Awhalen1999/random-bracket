import { NextResponse } from "next/server";
import { getDailyBracket, setDailyBracket } from "@/lib/daily_round";

export async function GET() {
  try {
    const bracketItems = await getDailyBracket();
    return NextResponse.json({ success: true, items: bracketItems });
  } catch (error: any) {
    console.error("Error fetching daily bracket:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch daily bracket",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    if (!Array.isArray(items) || items.length !== 16) {
      return NextResponse.json(
        { success: false, error: "You must provide exactly 16 items" },
        { status: 400 }
      );
    }

    const result = await setDailyBracket(items);
    return NextResponse.json({ success: true, items: result });
  } catch (error: any) {
    console.error("Error setting daily bracket:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to set daily bracket" },
      { status: 500 }
    );
  }
}
