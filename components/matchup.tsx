"use client";

import { useState } from "react";
import { Box, Button, Text, Stack } from "@chakra-ui/react";

interface MatchupProps {
  contenders: string[];
  onWinnerSelected: (winner: string) => void;
}

export default function Matchup({
  contenders,
  onWinnerSelected,
}: MatchupProps) {
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null);
  const [c1, c2] = contenders;
  const bothKnown = c1 !== "" && c2 !== "";

  const handleSelect = (choice: string) => {
    setSelectedWinner(choice);
    onWinnerSelected(choice);
  };

  const renderContender = (contender: string) => {
    if (contender === "") {
      return <Box minH="40px" />;
    }

    return (
      <Button
        variant={selectedWinner === contender ? "solid" : "outline"}
        colorScheme={selectedWinner === contender ? "blue" : "gray"}
        isDisabled={
          !bothKnown ||
          (selectedWinner !== null && selectedWinner !== contender)
        }
        onClick={() => handleSelect(contender)}
      >
        {contender}
      </Button>
    );
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      p={4}
      minW="150px"
      textAlign="center"
    >
      <Stack spacing={2}>
        {renderContender(c1)}
        {renderContender(c2)}
      </Stack>
    </Box>
  );
}
