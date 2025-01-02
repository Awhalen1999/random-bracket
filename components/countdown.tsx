"use client";

import { useEffect, useState } from "react";
import { Box, Text } from "@chakra-ui/react";

export default function CountdownToNextGrid() {
  const [timeLeft, setTimeLeft] = useState<string>("");

  // Helper to compute next UTC midnight
  function getNextResetTimeUTC() {
    const now = new Date();
    return new Date(
      Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() + 1,
        0,
        0,
        0
      )
    );
  }

  // Helper to calculate the time difference as "HH:mm:ss"
  function updateTimeLeft() {
    const now = new Date();
    const nextReset = getNextResetTimeUTC();
    const diffMs = nextReset.getTime() - now.getTime();

    if (diffMs <= 0) {
      // If we've passed the threshold, show "00:00:00"
      // or you could force a refresh to reload the bracket
      setTimeLeft("00:00:00");
      return;
    }

    // Convert ms to HH:mm:ss
    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    setTimeLeft(
      `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}:${String(seconds).padStart(2, "0")}`
    );
  }

  // Update countdown every second
  useEffect(() => {
    updateTimeLeft(); // initial
    const interval = setInterval(updateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box textAlign="center">
      <Text fontSize="sm" color="gray.600">
        Next bracket reset in: <strong>{timeLeft}</strong>
      </Text>
    </Box>
  );
}
