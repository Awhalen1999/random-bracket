import { getDb } from "./db";

/**
 * Fetch all items from the database.
 */
export async function fetchAllItems() {
  const db = await getDb();
  const items = await db.collection("items").find({}).toArray();
  return items;
}

/**
 * Add a new item to the database.
 * @param name - Name of the item.
 */
export async function addItem(name: string) {
  const db = await getDb();
  const result = await db.collection("items").insertOne({
    name: name.trim(),
    created_at: new Date(),
  });
  return result.ops[0];
}
