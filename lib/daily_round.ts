import { getDb } from "./db";

/**
 * Gets or creates today's bracket of 16 random items.
 */
export async function getDailyBracket(): Promise<string[]> {
  const db = await getDb();
  const today = new Date().toISOString().split("T")[0];

  let dailyDoc = await db.collection("daily_round").findOne({ date: today });
  if (!dailyDoc) {
    // Randomly select 16 active items
    const items = await db
      .collection("items")
      .aggregate([
        { $match: { active: { $ne: false } } }, // Only items that are not false
        { $sample: { size: 16 } },
      ])
      .toArray();

    const itemNames = items.map((item: any) => item.name);

    // Insert a new daily round doc
    await db.collection("daily_round").insertOne({
      date: today,
      items: itemNames,
      createdAt: new Date(),
    });

    return itemNames;
  }

  return dailyDoc.items;
}

/**
 * Manually sets today's bracket (admin override).
 */
export async function setDailyBracket(items: string[]): Promise<string[]> {
  if (items.length !== 16) {
    throw new Error("You must provide exactly 16 items.");
  }

  const db = await getDb();
  const today = new Date().toISOString().split("T")[0];

  await db.collection("daily_round").updateOne(
    { date: today },
    {
      $set: {
        items,
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  return items;
}
