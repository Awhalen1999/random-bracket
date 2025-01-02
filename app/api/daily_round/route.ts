import { NextResponse } from "next/server";
import { getDailyBracket, setDailyBracket } from "@/lib/daily_round";

export async function GET() {
  try {
    const bracketItems = await getDailyBracket();
    return NextResponse.json({ success: true, items: bracketItems });
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch daily bracket" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    const updated = await setDailyBracket(items);
    return NextResponse.json({ success: true, items: updated });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to set daily bracket" },
      { status: 500 }
    );
  }
}
