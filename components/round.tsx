"use client";
import { useState, useEffect } from "react";
import { Box, Heading, Stack } from "@chakra-ui/react";
import Matchup from "./matchup";

interface RoundProps {
  roundName: string;
  entries: string[];
  onWinnersSelected: (winners: string[]) => void;
}

export default function Round({
  roundName,
  entries,
  onWinnersSelected,
}: RoundProps) {
  const pairs = [];
  for (let i = 0; i < entries.length; i += 2) {
    pairs.push([entries[i], entries[i + 1]]);
  }

  const [winners, setWinners] = useState<string[]>([]);

  useEffect(() => {
    if (winners.length === pairs.length && pairs.length > 0) {
      onWinnersSelected(winners);
    }
  }, [winners, pairs.length, onWinnersSelected]);

  return (
    <Box mb={6}>
      <Heading as="h3" size="md" mb={2}>
        {roundName}
      </Heading>
      <Stack>
        {pairs.map((pair, index) => (
          <Matchup
            key={index}
            contenders={pair}
            onWinnerSelected={(winner) => {
              setWinners((prev) => {
                const newWinners = [...prev];
                newWinners[index] = winner;
                return newWinners;
              });
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}
