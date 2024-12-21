const apiUrl =
  process.env.NEXT_PUBLIC_API_URL === "production"
    ? "https://your-production-domain.com" // Replace with your production backend URL
    : "http://localhost:3000"; // Local URL during development

/**
 * Fetch all items.
 */
export async function fetchAllItems() {
  const response = await fetch(`${apiUrl}/api/items`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to fetch items");
  }
  return data.items;
}

/**
 * Add a new item.
 * @param name - Name of the new item.
 */
export async function addNewItem(name: string) {
  const response = await fetch(`${apiUrl}/api/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to add item");
  }
  return data.item;
}

/**
 * Fetch today's bracket.
 */
export async function fetchDailyBracket() {
  const response = await fetch(`${apiUrl}/api/daily_round`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to fetch daily bracket");
  }
  return data.items;
}

/**
 * Manually set today's bracket (Admin).
 * @param items - Array of 16 item names.
 */
export async function setDailyBracket(items: string[]) {
  const response = await fetch(`${apiUrl}/api/daily_round`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ items }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to set daily bracket");
  }
  return data.items;
}

/**
 * Submit a vote for a winner.
 * @param winner - Name of the winning item.
 */
export async function submitVote(winner: string) {
  const response = await fetch(`${apiUrl}/api/results`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ winner }),
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to submit vote");
  }
  return data.result;
}

/**
 * Fetch today's voting results.
 */
export async function fetchDailyResults() {
  const response = await fetch(`${apiUrl}/api/results`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();
  if (!response.ok || !data.success) {
    throw new Error(data.error || "Failed to fetch results");
  }
  return data.results;
}
