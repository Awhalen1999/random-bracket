import type {
  TodayBracketResponse,
  SubmitBracketRequest,
  SubmitBracketResponse,
  ResultsResponse,
} from "@/api/bracket";

const STORAGE_KEY = "random-bracket-offline-submissions";

// 16 placeholder items for demo mode
const OFFLINE_ITEMS = [
  { id: "1", name: "Coffee" },
  { id: "2", name: "Pizza" },
  { id: "3", name: "Sunshine" },
  { id: "4", name: "Mountains" },
  { id: "5", name: "Dogs" },
  { id: "6", name: "Tacos" },
  { id: "7", name: "Sleep" },
  { id: "8", name: "Music" },
  { id: "9", name: "Beach" },
  { id: "10", name: "Books" },
  { id: "11", name: "Chocolate" },
  { id: "12", name: "Cats" },
  { id: "13", name: "Road Trips" },
  { id: "14", name: "Video Games" },
  { id: "15", name: "Ice Cream" },
  { id: "16", name: "Naps" },
];

type OfflineSubmission = {
  winnerId: string;
  winnerName: string;
  submittedAt: string;
};

type OfflineSubmissions = Record<string, OfflineSubmission>;

function getStoredSubmissions(): OfflineSubmissions {
  if (typeof window === "undefined") return {};
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
}

function saveSubmission(date: string, submission: OfflineSubmission): void {
  const submissions = getStoredSubmissions();
  submissions[date] = submission;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
}

export async function getOfflineTodayBracket(): Promise<TodayBracketResponse> {
  const today = new Date().toISOString().split("T")[0];
  return {
    date: today,
    items: OFFLINE_ITEMS,
  };
}

export async function submitOfflineBracket(
  data: SubmitBracketRequest
): Promise<SubmitBracketResponse> {
  const today = new Date().toISOString().split("T")[0];
  const item = OFFLINE_ITEMS.find((i) => i.id === data.winnerId);

  saveSubmission(today, {
    winnerId: data.winnerId,
    winnerName: item?.name || data.winnerId,
    submittedAt: new Date().toISOString(),
  });

  return {
    success: true,
    message: "Bracket submitted successfully (offline mode)",
  };
}

export async function getOfflineResults(date: string): Promise<ResultsResponse> {
  const submissions = getStoredSubmissions();
  const submission = submissions[date];

  if (!submission) {
    return {
      date,
      totalVotes: 0,
      results: [],
    };
  }

  return {
    date,
    totalVotes: 1,
    results: [
      {
        id: submission.winnerId,
        name: submission.winnerName,
        votes: 1,
        percentage: 100,
      },
    ],
  };
}
