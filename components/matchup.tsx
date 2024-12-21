"use client";

import { useState } from "react";
import { Box, Stack } from "@chakra-ui/react";

interface MatchupProps {
  contenders: string[];
  onWinnerSelected: (winner: string) => void;
  colorMap: { [key: string]: string };
}

export default function Matchup({
  contenders,
  onWinnerSelected,
  colorMap,
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
      return (
        <Box
          width="150px"
          minH="40px"
          whiteSpace="normal"
          wordBreak="break-word"
          overflowWrap="break-word"
          borderWidth="1px"
          borderRadius="md"
          p={2}
        />
      );
    }

    const isSelected = selectedWinner === contender;
    const isDisabled = !bothKnown;
    const bgColor = colorMap[contender] || "transparent";

    return (
      <Box
        as="button"
        fontWeight="semibold"
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
        opacity={isDisabled ? 0.7 : 1}
        backgroundColor={bgColor}
        _hover={
          !isDisabled
            ? { backgroundColor: isSelected ? "blue.200" : bgColor }
            : {}
        }
      >
        {contender}
      </Box>
    );
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
