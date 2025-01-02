// lib/results.ts
import { getDb } from "./db";

/**
 * Retrieve raw results for today's bracket (no percentage logic).
 */
export async function getDailyResults() {
  const db = await getDb();
  const today = new Date().toISOString().split("T")[0];

  // Just fetch today's docs from the `results` collection
  const docs = await db.collection("results").find({ date: today }).toArray();

  // Return them in a consistent shape
  return docs.map((doc) => ({
    winner: doc.winner,
    count: doc.count || 0,
  }));
}

/**
 * Submits a vote for a winner.
 * Increments the winner's `count` by 1 in today's results.
 */
export async function submitResult(winner: string) {
  const db = await getDb();
  const today = new Date().toISOString().split("T")[0];

  // Double-check the winner is in today's bracket
  const dailyRound = await db
    .collection("daily_round")
    .findOne({ date: today });
  if (!dailyRound || !dailyRound.items.includes(winner)) {
    throw new Error("Invalid winner. The item is not in today's bracket.");
  }

  await db
    .collection("results")
    .updateOne(
      { date: today, winner },
      { $inc: { count: 1 }, $set: { updatedAt: new Date() } }
    );

  // Return the updated doc
  const newDoc = await db
    .collection("results")
    .findOne({ date: today, winner });

  return {
    date: today,
    winner: newDoc?.winner,
    count: newDoc?.count ?? 0,
  };
}

/**
 * Retrieves the 16 items in today's bracket, sorted by descending count,
 * plus winning percentage (count / totalVotes * 100).
 */
export async function getDailyStats() {
  const db = await getDb();
  const today = new Date().toISOString().split("T")[0];

  // Grab daily bracket items
  const dailyRound = await db
    .collection("daily_round")
    .findOne({ date: today });
  if (!dailyRound) {
    return [];
  }

  // Grab all results for today
  const itemsInResults = await db
    .collection("results")
    .find({ date: today })
    .toArray();

  // We expect 16 docs in `results` seeded for today, but let's be safe
  const totalVotes = itemsInResults.reduce(
    (acc, doc: any) => acc + (doc.count || 0),
    0
  );

  // Compute percentages
  const resultsWithPct = itemsInResults.map((doc) => {
    const count = doc.count || 0;
    const pct = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
    return {
      winner: doc.winner,
      count,
      percentage: pct,
    };
  });

  // Sort by descending count
  resultsWithPct.sort((a, b) => b.count - a.count);

  return resultsWithPct;
}
