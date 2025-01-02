import { getDb } from "./db";

/**
 * Gets or creates today's bracket of 16 random items.
 * Also seeds those items in the results collection with count: 0 if missing.
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
        { $match: { active: { $ne: false } } },
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

    // Seed results collection with count: 0
    await seedResultsForToday(itemNames);

    return itemNames;
  }

  // If dailyDoc exists, ensure results are seeded as well
  await seedResultsForToday(dailyDoc.items);

  return dailyDoc.items;
}

/**
 * Manually sets today's bracket (admin override).
 * Also seeds the results collection with count: 0 for these items.
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

  // Seed results collection with count: 0 for these items
  await seedResultsForToday(items);

  return items;
}

/**
 * Ensures that each item in today's bracket has an entry in the 'results' collection at count: 0.
 */
async function seedResultsForToday(itemNames: string[]) {
  const db = await getDb();
  const today = new Date().toISOString().split("T")[0];

  const bulkOps = itemNames.map((name) => ({
    updateOne: {
      filter: { date: today, winner: name },
      update: {
        $setOnInsert: {
          date: today,
          winner: name,
          count: 0,
          createdAt: new Date(),
        },
      },
      upsert: true,
    },
  }));

  if (bulkOps.length) {
    await db.collection("results").bulkWrite(bulkOps);
  }
}
