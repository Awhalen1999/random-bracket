const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type BracketItem = {
  id: string;
  name: string;
};

export type TodayBracketResponse = {
  date: string;
  items: BracketItem[];
};

export type BracketResult = {
  id: string;
  name: string;
  votes: number;
  percentage: number;
};

export type ResultsResponse = {
  date: string;
  totalVotes: number;
  results: BracketResult[];
};

export type SubmitBracketRequest = {
  winnerId: string;
};

export type SubmitBracketResponse = {
  success: boolean;
  message: string;
};

// GET /api/today
export async function getTodaysBracket(): Promise<TodayBracketResponse> {
  const response = await fetch(`${API_URL}/api/today`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch today's bracket");
  }
  return response.json();
}

// POST /api/submit
export async function submitBracket(
  data: SubmitBracketRequest
): Promise<SubmitBracketResponse> {
  const response = await fetch(`${API_URL}/api/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to submit bracket");
  }

  return response.json();
}

// GET /api/results/:date
export async function getResults(date: string): Promise<ResultsResponse> {
  const response = await fetch(`${API_URL}/api/results/${date}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to fetch results");
  }
  return response.json();
}
