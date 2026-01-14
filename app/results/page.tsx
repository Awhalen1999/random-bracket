"use client";

import { useResults } from "@/hooks/useBracket";
import { OFFLINE_MODE } from "@/lib/offline-config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = [
  "#22c55e", "#3b82f6", "#eab308", "#ef4444", "#a855f7",
  "#ec4899", "#f97316", "#14b8a6", "#6366f1", "#84cc16",
  "#f43f5e", "#06b6d4", "#8b5cf6", "#10b981", "#f59e0b", "#64748b",
];

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

  if (!data || data.results.length === 0) {
    return (
      <div className="p-8 text-white">
        <h1 className="text-3xl font-bold mb-4">Results</h1>
        {OFFLINE_MODE && (
          <p className="text-yellow-400 text-sm mb-4">
            Showing your local submissions (offline mode)
          </p>
        )}
        <p className="text-zinc-400">No submissions yet. Complete a bracket to see your results!</p>
      </div>
    );
  }

  const winner = data.results[0];
  const pieData = data.results.map((r) => ({ name: r.name, value: r.votes }));

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-2">Results for {data.date}</h1>
      {OFFLINE_MODE && (
        <p className="text-yellow-400 text-sm mb-6">
          Showing your local submissions (offline mode)
        </p>
      )}

      <div className="space-y-4">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-3">
            <CardDescription className="text-zinc-400">Your Champion</CardDescription>
            <CardTitle className="flex items-center gap-3 text-2xl">
              <Trophy className="h-6 w-6 text-yellow-500" />
              {winner.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-zinc-400">
              <span className="text-white font-semibold">{winner.percentage}%</span> of voters picked this as their champion
            </p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Full Breakdown</CardTitle>
            <CardDescription className="text-zinc-400">
              {data.totalVotes} total vote{data.totalVotes !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.results.map((result, index) => (
                <div key={result.id} className="flex items-center gap-3">
                  <span className="text-zinc-500 w-6 text-sm">{index + 1}.</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm">{result.name}</span>
                      <span className="text-zinc-400 text-sm">
                        {result.votes} vote{result.votes !== 1 ? "s" : ""} ({result.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-zinc-800 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${result.percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Vote Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #3f3f46",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                    itemStyle={{ color: "#fff" }}
                    labelStyle={{ color: "#fff" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap gap-3 mt-4 justify-center">
              {data.results.map((result, index) => (
                <div key={result.id} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-zinc-400">{result.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
