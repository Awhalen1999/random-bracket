"use client";

import React, { useEffect, useState } from "react";

export default function StatsPage() {
  const [stats, setStats] = useState<
    { winner: string; count: number; percentage: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/results?stats=true");
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to fetch stats");
      }
      setStats(data.stats);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <p>Loading stats...</p>;
  }

  if (stats.length === 0) {
    return <p>No stats available for today yet.</p>;
  }

  return (
    <>
      <h2>Today's Bracket Stats</h2>
      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Count</th>
            <th>Winning %</th>
          </tr>
        </thead>
        <tbody>
          {stats.map((item) => (
            <tr key={item.winner}>
              <td>{item.winner}</td>
              <td>{item.count}</td>
              <td>{item.percentage.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
