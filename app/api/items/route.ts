import { NextResponse } from "next/server";
import { fetchRandomItems, addNewItem } from "@/lib/items";

export async function GET() {
  try {
    // Return 16 random items (active only)
    const items = await fetchRandomItems(16);
    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch random items" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    const newItem = await addNewItem(name);
    return NextResponse.json({ success: true, item: newItem });
  } catch (error: any) {
    console.error(error);

    // Check for potential duplicates
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Item name already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, error: error.message || "Failed to add item" },
      { status: 500 }
    );
  }
}
