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
  const c1 = contenders[0];
  const c2 = contenders[1];

  const c1Known = c1 !== "";
  const c2Known = c2 !== "";
  const bothKnown = c1Known && c2Known;

  const handleSelect = (choice: string) => {
    setSelectedWinner(choice);
    onWinnerSelected(choice);
  };

  const renderContender = (contender: string) => {
    if (contender === "") {
      // Empty slot
      return <Box minH="40px" />;
    }
    // Known contender
    // If both known, we can enable button, else disabled.
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
      <Text fontWeight="semibold" mb={2}>
        Matchup
      </Text>
      <Stack>
        {renderContender(c1)}
        {renderContender(c2)}
      </Stack>
    </Box>
  );
}
