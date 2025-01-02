import { NextResponse } from "next/server";
import { submitResult, getDailyResults } from "@/lib/results";

export async function GET() {
  try {
    const results = await getDailyResults();
    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch daily results" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { winner } = await request.json();
    const resultDoc = await submitResult(winner);
    return NextResponse.json({ success: true, result: resultDoc });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit result" },
      { status: 500 }
    );
  }
}
