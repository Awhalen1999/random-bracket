"use client";

import { useResults } from "@/hooks/useBracket";

export default function ResultsPage() {
  const today = new Date().toISOString().split("T")[0];
  const { data, isLoading, error } = useResults(today);

  if (isLoading) {
    return <div className="p-8 text-white">Loading results...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-white">
        Error: {error instanceof Error ? error.message : "Failed to load results"}
      </div>
    );
  }

  if (!data) {
    return <div className="p-8 text-white">No results available</div>;
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-4">Results for {data.date}</h1>
      <p className="mb-8">Total Votes: {data.totalVotes}</p>

      <pre className="bg-zinc-800 p-4 rounded overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
