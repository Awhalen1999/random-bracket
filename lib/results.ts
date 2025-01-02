import { getDb } from "./db";

/**
 * Submits a vote for a winner. Checks that the winner is in today's bracket.
 */
export async function submitResult(winner: string) {
  const db = await getDb();
  const today = new Date().toISOString().split("T")[0];

  // Check if the winner is in today's bracket
  const dailyRound = await db
    .collection("daily_round")
    .findOne({ date: today });
  if (!dailyRound || !dailyRound.items.includes(winner)) {
    throw new Error("Invalid winner. The item is not in today's bracket.");
  }

  // Upsert the winner in 'results' collection
  const updateRes = await db
    .collection("results")
    .updateOne(
      { date: today, winner },
      { $inc: { count: 1 }, $set: { updatedAt: new Date() } },
      { upsert: true }
    );

  // Return the updated doc
  const newCountDoc = await db
    .collection("results")
    .findOne({ date: today, winner });
  return {
    date: today,
    winner: newCountDoc?.winner,
    count: newCountDoc?.count ?? 1,
  };
}

/**
 * Retrieves today's voting results (how many times each item has won).
 */
export async function getDailyResults() {
  const db = await getDb();
  const today = new Date().toISOString().split("T")[0];

  const docs = await db.collection("results").find({ date: today }).toArray();
  return docs.map((doc) => ({
    winner: doc.winner,
    count: doc.count,
  }));
}
