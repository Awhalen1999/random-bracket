"use client";

import { useEffect, useState } from "react";
import { Box, Text, Spinner, VStack, Heading, Link } from "@chakra-ui/react";
import Bracket from "@/components/bracket";
import NextLink from "next/link";

export default function Page() {
  const [entries, setEntries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [finalWinner, setFinalWinner] = useState<string | null>(null);
  const [alreadyVoted, setAlreadyVoted] = useState(false);

  /**
   * Fetch daily bracket
   */
  const fetchDailyBracket = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/daily_round");
      const data = await res.json();
      console.log(`[Frontend] Fetch daily bracket response:`, data);

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch daily bracket");
      }
      setEntries(data.items);
    } catch (err) {
      console.error(`[Frontend] Error fetching daily bracket:`, err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * On component mount, check localStorage if user has voted
   */
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const localKey = `bracketVoted-${today}`;
    const hasVoted = localStorage.getItem(localKey);

    if (hasVoted) {
      setAlreadyVoted(true);
      // Retrieve the stored winner if available
      const storedWinner = localStorage.getItem(`bracketWinner-${today}`);
      if (storedWinner) setFinalWinner(storedWinner);
    }

    fetchDailyBracket();
  }, []);

  /**
   * Handle the final winner selected in the bracket
   */
  const handleWinnerSelected = async (winner: string) => {
    console.log(`[Frontend] Winner selected: "${winner}"`);

    if (alreadyVoted) {
      console.warn(`[Frontend] User has already voted today.`);
      return;
    }

    try {
      const response = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ winner }),
      });

      const data = await response.json();
      console.log(`[Frontend] Submit winner response:`, data);

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to submit result");
      }

      // Mark localStorage so the user can't vote again
      const today = new Date().toISOString().split("T")[0];
      localStorage.setItem(`bracketVoted-${today}`, "true");
      localStorage.setItem(`bracketWinner-${today}`, winner);

      setAlreadyVoted(true);
      setFinalWinner(winner);

      console.log(`[Frontend] Successfully voted for: ${winner}`);
    } catch (err) {
      console.error(`[Frontend] Error submitting winner:`, err);
      // Optional: Display a non-intrusive error message
      // You can set an error state and conditionally render an error message below
    }
  };

  /**
   * UI rendering
   */
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

  // Map each item to a color
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
      <VStack align="center" mb={6}>
        <Heading size="lg" textAlign="center">
          Daily Bracket Challenge
        </Heading>
        <Text textAlign="center" fontSize="md" color="gray.600">
          Every 24 hours, we generate 16 random things. Pick your ultimate
          champion!
        </Text>
      </VStack>

      {/* Champion Display */}
      {finalWinner && (
        <Box mb={6}>
          <Heading size="md">Champion: {finalWinner}</Heading>
        </Box>
      )}

      {/* The bracket itself */}
      <Bracket
        entries={entries}
        colorMap={colorMap}
        onWinnerSelected={handleWinnerSelected}
      />

      {/* Voted Message */}
      {alreadyVoted && finalWinner && (
        <Box mt={8} textAlign="center">
          <Text fontSize="sm" color="gray.600">
            Already chose a winner for today: <strong>{finalWinner}</strong>.{" "}
            <NextLink href="/stats" passHref>
              <Link color="blue.500">Check out today's stats</Link>
            </NextLink>
          </Text>
        </Box>
      )}
    </Box>
  );
}
