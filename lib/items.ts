import { getDb } from "./db";
import { ObjectId } from "mongodb";

/**
 * Fetch 16 random active items (for reference, if you need it somewhere).
 */
export async function fetchRandomItems(count = 16) {
  const db = await getDb();
  return db
    .collection("items")
    .aggregate([
      { $match: { active: { $ne: false } } },
      { $sample: { size: count } },
    ])
    .toArray();
}

/**
 * Fetch all items (optionally only active).
 */
export async function fetchAllItems(onlyActive = false) {
  const db = await getDb();
  const filter = onlyActive ? { active: { $ne: false } } : {};
  return db.collection("items").find(filter).toArray();
}

/**
 * Add a new item.
 */
export async function addNewItem(name: string) {
  const db = await getDb();
  const trimmedName = name.trim();
  if (!trimmedName) throw new Error("Item name cannot be empty.");

  const result = await db.collection("items").insertOne({
    name: trimmedName,
    active: true,
    createdAt: new Date(),
  });

  // Return the newly inserted doc
  return {
    _id: result.insertedId,
    name: trimmedName,
    active: true,
    createdAt: new Date(),
  };
}

/**
 * Deactivate or activate an item (optional if you need this).
 */
export async function updateItemStatus(id: string, active: boolean) {
  const db = await getDb();
  const _id = new ObjectId(id);

  await db
    .collection("items")
    .updateOne({ _id }, { $set: { active, updatedAt: new Date() } });

  return { _id, active };
}
