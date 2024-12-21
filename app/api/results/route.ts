import { NextResponse } from "next/server";
import { submitResult, getDailyResults } from "@/lib/results";

export async function GET() {
  try {
    const results = await getDailyResults();
    return NextResponse.json({ success: true, results });
  } catch (error: any) {
    console.error("Error fetching results:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch results" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { winner } = await request.json();

    if (!winner || typeof winner !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid winner" },
        { status: 400 }
      );
    }

    const result = await submitResult(winner.trim());
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    console.error("Error submitting result:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit result" },
      { status: 500 }
    );
  }
}
