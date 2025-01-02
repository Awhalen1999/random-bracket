"use client";

import { useEffect, useState } from "react";
import { Box, Text, Spinner, Button } from "@chakra-ui/react";
import Bracket from "@/components/bracket";

export default function Page() {
  const [entries, setEntries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [finalWinner, setFinalWinner] = useState<string | null>(null);
  const [alreadyVoted, setAlreadyVoted] = useState(false);

  // Fetch daily bracket
  const fetchDailyBracket = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/daily_round");
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || "Failed to fetch daily bracket");
      }
      setEntries(data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // On component mount, check localStorage if user has voted
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const localKey = `bracketVoted-${today}`;
    const hasVoted = localStorage.getItem(localKey);
    if (hasVoted) {
      setAlreadyVoted(true);
    }

    fetchDailyBracket();
  }, []);

  // When the bracket is done, we’ll have the final winner in state (passed from Bracket)
  const handleWinnerSelected = (winner: string) => {
    setFinalWinner(winner);
  };

  // Submit the winner to the server
  const handleFinishBracket = async () => {
    if (!finalWinner) return;

    try {
      const response = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ winner: finalWinner }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to submit result");
      }
      alert(`Thanks! You chose: ${finalWinner}`);

      // Mark localStorage so user can't vote again
      const today = new Date().toISOString().split("T")[0];
      const localKey = `bracketVoted-${today}`;
      localStorage.setItem(localKey, "true");

      setAlreadyVoted(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Try again later.");
    }
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="lg" />
        <Text mt={4}>Loading bracket...</Text>
      </Box>
    );
  }

  if (entries.length !== 16) {
    return (
      <Box textAlign="center" mt={20}>
        <Text fontSize="xl" color="red.500">
          Unable to fetch 16 items. Please try again later.
        </Text>
      </Box>
    );
  }

  // Define distinct colors for the bracket items
  const colors = [
    "tomato",
    "green.700",
    "blue.500",
    "yellow.600",
    "purple.500",
    "orange.500",
    "teal.600",
    "pink.800",
    "cyan.600",
    "red.500",
    "gray.600",
    "purple.800",
    "green.600",
    "brown",
    "pink.600",
    "navy",
  ];

  // Map items to colors
  const colorMap: Record<string, string> = {};
  entries.forEach((item, index) => {
    colorMap[item] = colors[index % colors.length];
  });

  return (
    <Box
      maxW="97vw"
      mx="auto"
      p={4}
      overflowX="auto"
      height="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Text mb={4} textAlign="center">
        Every 24 hours we generate 16 random things. Pick a winner bracket
        style.
      </Text>

      <Bracket
        entries={entries}
        colorMap={colorMap}
        onWinnerSelected={handleWinnerSelected}
      />

      {!alreadyVoted && finalWinner && (
        <Button mt={4} colorScheme="blue" onClick={handleFinishBracket}>
          Finish Bracket (Winner: {finalWinner})
        </Button>
      )}

      {alreadyVoted && (
        <Text mt={4} color="green.600">
          You have already voted today!
        </Text>
      )}
    </Box>
  );
}
