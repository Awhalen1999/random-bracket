"use client";

import { useState } from "react";
import { Box, Text, Stack, Button } from "@chakra-ui/react";

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
    // If empty, just show an empty box
    if (contender === "") {
      return (
        <Box
          width="150px"
          minH="40px"
          whiteSpace="normal"
          wordBreak="break-word"
          overflowWrap="break-word"
          borderWidth="1px"
          borderColor="gray.200"
          borderRadius="md"
          p={2}
        />
      );
    }

    const isSelected = selectedWinner === contender;

    // Instead of disabling the other option once one is chosen,
    // we allow the user to switch by always keeping the other option clickable.
    const isDisabled = !bothKnown; // Only disable if both aren't known

    return (
      <Box
        as="button"
        onClick={() => !isDisabled && handleSelect(contender)}
        width="150px"
        whiteSpace="normal"
        wordBreak="break-word"
        overflowWrap="break-word"
        textAlign="center"
        borderWidth="1px"
        borderRadius="md"
        px={2}
        py={1}
        cursor={isDisabled ? "not-allowed" : "pointer"}
        opacity={isDisabled ? 0.6 : 1}
      >
        {contender}
      </Box>
    );
  };

  const clearSelection = () => {
    setSelectedWinner(null);
    onWinnerSelected(""); // if you want to indicate no winner is selected
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="md"
      p={4}
      textAlign="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="max-content"
    >
      <Stack align="center">
        {renderContender(c1)}
        {renderContender(c2)}
      </Stack>
    </Box>
  );
}
