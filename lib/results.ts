import { getDb } from "./db";

/**
 * Submits a vote for a winner.
 * Increments the winner's `count` by 1 in today's results.
 */
export async function submitResult(winner: string) {
  const db = await getDb();
  const today = new Date().toISOString().split("T")[0];

  console.log(
    `[submitResult] Called with winner: "${winner}" on date: ${today}`
  );

  // Double-check the winner is in today's bracket
  const dailyRound = await db
    .collection("daily_round")
    .findOne({ date: today });
  console.log(`[submitResult] Today's bracket items:`, dailyRound?.items);

  if (!dailyRound || !dailyRound.items.includes(winner)) {
    console.error(
      `[submitResult] Invalid winner: "${winner}" is not in today's bracket.`
    );
    throw new Error("Invalid winner. The item is not in today's bracket.");
  }

  // Increment the count for the winner
  const updateRes = await db
    .collection("results")
    .updateOne(
      { date: today, winner },
      { $inc: { count: 1 }, $set: { updatedAt: new Date() } }
    );

  console.log(`[submitResult] Update result:`, updateRes);

  // Return the updated doc
  const newDoc = await db
    .collection("results")
    .findOne({ date: today, winner });
  console.log(`[submitResult] New document:`, newDoc);

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
  console.log(`[getDailyStats] Called for date: ${today}`);

  // Grab daily bracket items
  const dailyRound = await db
    .collection("daily_round")
    .findOne({ date: today });
  if (!dailyRound) {
    console.warn(`[getDailyStats] No daily round found for date: ${today}`);
    return [];
  }

  console.log(`[getDailyStats] Today's bracket items:`, dailyRound.items);

  // Grab all results for today
  const itemsInResults = await db
    .collection("results")
    .find({ date: today })
    .toArray();
  console.log(`[getDailyStats] Results fetched:`, itemsInResults);

  // We expect exactly 16 docs in `results` seeded for today, but let's be safe
  const totalVotes = itemsInResults.reduce(
    (acc, doc: any) => acc + (doc.count || 0),
    0
  );
  console.log(`[getDailyStats] Total votes: ${totalVotes}`);

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

  // Sort by descending count (or descending pct)
  resultsWithPct.sort((a, b) => b.count - a.count);

  console.log(`[getDailyStats] Computed stats:`, resultsWithPct);

  return resultsWithPct;
}

/**
 * Retrieve raw results for today's bracket (no percentage logic).
 */
export async function getDailyResults() {
  const db = await getDb();
  const today = new Date().toISOString().split("T")[0];
  console.log(`[getDailyResults] Called for date: ${today}`);

  // Just fetch today's docs from the `results` collection
  const docs = await db.collection("results").find({ date: today }).toArray();
  console.log(`[getDailyResults] Results fetched:`, docs);

  // Return them in a consistent shape
  return docs.map((doc) => ({
    winner: doc.winner,
    count: doc.count || 0,
  }));
}
