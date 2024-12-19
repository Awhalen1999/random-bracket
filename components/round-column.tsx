"use client";
import { useState, useEffect } from "react";
import { Box, Heading, Stack, Flex } from "@chakra-ui/react";
import Matchup from "./matchup";

interface RoundColumnProps {
  roundName: string;
  entries: string[];
  pairs: number;
  onWinnersSelected: (winners: string[]) => void;
  columnIndex: number;
}

export default function RoundColumn({
  roundName,
  entries,
  pairs,
  onWinnersSelected,
}: RoundColumnProps) {
  const [winners, setWinners] = useState<string[]>([]);

  // Pair up the entries
  const matchups = [];
  for (let i = 0; i < entries.length; i += 2) {
    matchups.push([entries[i], entries[i + 1]]);
  }

  useEffect(() => {
    if (winners.length === pairs && pairs > 0) {
      onWinnersSelected(winners);
    }
  }, [winners, pairs, onWinnersSelected]);

  // To create a bracket-like spacing, we’ll use a Flex container with vertical spacing.
  // For a large bracket, you can experiment with minH values or use CSS to draw lines.
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      py={10}
    >
      <Heading as="h3" size="md" mb={4}>
        {roundName}
      </Heading>
      <Stack spacing={8}>
        {matchups.map((m, i) => (
          <Matchup
            key={i}
            contenders={m}
            onWinnerSelected={(winner) => {
              setWinners((prev) => {
                const newWinners = [...prev];
                newWinners[i] = winner;
                return newWinners;
              });
            }}
          />
        ))}
      </Stack>
    </Flex>
  );
}
