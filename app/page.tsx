"use client";

import { useEffect, useState } from "react";
import { Box, Text, Spinner } from "@chakra-ui/react";
import Bracket from "@/components/bracket";

export default function Page() {
  const [entries, setEntries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Fetches the daily bracket from the server.
   */
  const fetchDailyBracket = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/daily_round");
      const data = await response.json();

      if (data.success) {
        setEntries(data.items);
      } else {
        throw new Error(data.error || "Failed to fetch daily bracket");
      }
    } catch (err: any) {
      console.error("Error fetching daily bracket:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyBracket();
  }, []);

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
  const colorMap: { [key: string]: string } = {};
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
      justifyContent="center"
    >
      <Text mb={4} textAlign="center">
        Every 24 hours we generate 16 random things. Pick a winner march madness
        bracket style.
      </Text>
      <Bracket entries={entries} colorMap={colorMap} />
    </Box>
  );
}
