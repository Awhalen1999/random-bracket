import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const db = await getDb();

    // Fetch 16 random active items
    const items = await db
      .collection("items")
      .aggregate([
        { $match: { active: true } }, // Only active items
        { $sample: { size: 16 } }, // Randomly select 16 items
      ])
      .toArray();

    return NextResponse.json({ success: true, items });
  } catch (error) {
    console.error("Error fetching random items:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch random items" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { success: false, error: "Invalid item name" },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Insert the new item
    const result = await db.collection("items").insertOne({
      name: name.trim(),
      created_at: new Date(),
    });

    return NextResponse.json({
      success: true,
      item: {
        _id: result.insertedId,
        name: name.trim(),
        created_at: new Date(),
      },
    });
  } catch (error: any) {
    console.error("Error adding item:", error);
    if (error.code === 11000) {
      // Duplicate key error
      return NextResponse.json(
        { success: false, error: "Item name already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to add item" },
      { status: 500 }
    );
  }
}
