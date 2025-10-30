"use client";

import { useState, useEffect } from "react";

export default function CountdownTimer() {
  const calculateTimeLeft = () => {
    const now = new Date();
    // Get current UTC date
    const utcNow = new Date(now.toISOString());
    // Get tomorrow's UTC midnight
    const tomorrowUTC = new Date(
      Date.UTC(
        utcNow.getUTCFullYear(),
        utcNow.getUTCMonth(),
        utcNow.getUTCDate() + 1,
        0,
        0,
        0,
        0
      )
    );

    const diff = tomorrowUTC.getTime() - now.getTime();

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-zinc-400 text-sm">
      Next bracket in: <span className="font-mono">{timeLeft}</span>
    </div>
  );
}
