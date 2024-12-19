"use client";

import { Box, Heading, Stack } from "@chakra-ui/react";
import Matchup from "./matchup";

interface ColumnProps {
  title: string;
  entries: string[];
  pairs: number;
  onWinner: (matchIndex: number, winner: string) => void;
}

export default function Column({
  title,
  entries,
  pairs,
  onWinner,
}: ColumnProps) {
  const matches: [string, string][] = [];
  for (let i = 0; i < pairs; i++) {
    const c1 = entries[i * 2] || "";
    const c2 = entries[i * 2 + 1] || "";
    matches.push([c1, c2]);
  }

  return (
    <Box py={10} textAlign="center">
      <Heading as="h3" size="md" mb={4}>
        {title}
      </Heading>
      <Stack spacing={8}>
        {matches.map((m, i) => (
          <Matchup
            key={i}
            contenders={m}
            onWinnerSelected={(winner) => onWinner(i, winner)}
          />
        ))}
      </Stack>
    </Box>
  );
}
