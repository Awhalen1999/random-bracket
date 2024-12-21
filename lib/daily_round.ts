import { getDb } from "./db";

/**
 * Retrieves today's bracket. If it doesn't exist, selects 16 random items and stores them.
 */
export async function getDailyBracket(): Promise<string[]> {
  const db = await getDb();
  const today = new Date().toISOString().split("T")[0];

  let doc = await db.collection("daily_round").findOne({ date: today });

  if (!doc) {
    // Select 16 random active items
    const randomItems = await db
      .collection("items")
      .aggregate([{ $sample: { size: 16 } }])
      .toArray();
    const itemNames = randomItems.map((item: any) => item.name);

    // Store the daily round
    await db.collection("daily_round").insertOne({
      date: today,
      items: itemNames,
    });

    return itemNames;
  }

  return doc.items;
}

/**
 * Manually sets today's bracket with provided items.
 * @param items - Array of 16 item names.
 */
export async function setDailyBracket(items: string[]): Promise<string[]> {
  const db = await getDb();
  const today = new Date().toISOString().split("T")[0];

  await db
    .collection("daily_round")
    .updateOne({ date: today }, { $set: { items } }, { upsert: true });

  return items;
}
