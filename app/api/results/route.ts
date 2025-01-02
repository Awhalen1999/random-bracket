import { NextResponse } from "next/server";
import { submitResult, getDailyResults, getDailyStats } from "@/lib/results";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const showStats = searchParams.get("stats");

    console.log(`[API GET /api/results] showStats: ${showStats}`);

    if (showStats === "true") {
      const stats = await getDailyStats();
      console.log(`[API GET /api/results] Returning stats:`, stats);
      return NextResponse.json({ success: true, stats });
    } else {
      const results = await getDailyResults();
      console.log(`[API GET /api/results] Returning results:`, results);
      return NextResponse.json({ success: true, results });
    }
  } catch (error: any) {
    console.error(`[API GET /api/results] Error:`, error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch daily results" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { winner } = await request.json();
    console.log(`[API POST /api/results] Received winner: "${winner}"`);

    const resultDoc = await submitResult(winner);
    console.log(`[API POST /api/results] Result after submission:`, resultDoc);

    return NextResponse.json({ success: true, result: resultDoc });
  } catch (error: any) {
    console.error(`[API POST /api/results] Error:`, error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to submit result" },
      { status: 500 }
    );
  }
}
