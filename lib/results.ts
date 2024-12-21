import { getDb } from "./db";

/**
 * Submits a vote for a winner. Increments the count for the winner on today's date.
 * @param winner - Name of the winning item.
 */
export async function submitResult(winner: string) {
  const db = await getDb();
  const today = new Date().toISOString().split("T")[0];

  // Ensure the winner is part of today's bracket
  const dailyRound = await db
    .collection("daily_round")
    .findOne({ date: today });
  if (!dailyRound || !dailyRound.items.includes(winner)) {
    throw new Error("Invalid winner. The item is not part of today's bracket.");
  }

  // Increment the count for the winner
  const result = await db
    .collection("results")
    .updateOne(
      { date: today, winner },
      { $inc: { count: 1 } },
      { upsert: true }
    );

  return {
    date: today,
    winner,
    count: result.upsertedId ? 1 : result.modifiedCount,
  };
}

/**
 * Retrieves today's voting results.
 */
export async function getDailyResults(): Promise<
  { winner: string; count: number }[]
> {
  const db = await getDb();
  const today = new Date().toISOString().split("T")[0];

  const results = await db
    .collection("results")
    .find({ date: today })
    .toArray();
  return results.map((res: any) => ({ winner: res.winner, count: res.count }));
}
