"use client";

import { useState } from "react";
import { Flex, Box, Heading } from "@chakra-ui/react";
import Column from "./column";

interface BracketProps {
  entries: string[];
}

export default function Bracket({ entries }: BracketProps) {
  const leftR16 = entries.slice(0, 8);
  const rightR16 = entries.slice(8, 16);

  // Next rounds start empty
  const [leftQFState, setLeftQFState] = useState(Array(4).fill(""));
  const [leftSFState, setLeftSFState] = useState(Array(2).fill(""));
  const [leftFState] = useState(Array(1).fill("")); // Not directly manipulated since we go straight to final

  const [rightQFState, setRightQFState] = useState(Array(4).fill(""));
  const [rightSFState, setRightSFState] = useState(Array(2).fill(""));
  const [rightFState] = useState(Array(1).fill("")); // Not directly manipulated

  const [finalState, setFinalState] = useState(Array(2).fill(""));
  const [champion, setChampion] = useState<string>("");

  function propagateWinner(
    winner: string,
    fromMatchIndex: number,
    nextRoundSetter: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    const nextMatchIndex = Math.floor(fromMatchIndex / 2);
    const slot = fromMatchIndex % 2;
    const nextIndex = nextMatchIndex * 2 + slot;

    nextRoundSetter((prev) => {
      const newArr = [...prev];
      newArr[nextIndex] = winner;
      return newArr;
    });
  }

  function propagateToFinal(winner: string, isLeftSide: boolean) {
    setFinalState((prev) => {
      const newArr = [...prev];
      newArr[isLeftSide ? 0 : 1] = winner;
      return newArr;
    });
  }

  function propagateChampion(winner: string) {
    setChampion(winner);
  }

  return (
    <Flex
      display="grid"
      gridTemplateColumns="repeat(7, minmax(120px, 1fr))"
      alignItems="center"
      justifyContent="center"
      gap={4}
    >
      {/* Left Side */}
      <Column
        title="Left Round of 16"
        entries={leftR16}
        pairs={4}
        onWinner={(index, winner) =>
          propagateWinner(winner, index, setLeftQFState)
        }
      />
      <Column
        title="Left Quarterfinals"
        entries={leftQFState}
        pairs={2}
        onWinner={(index, winner) =>
          propagateWinner(winner, index, setLeftSFState)
        }
      />
      <Column
        title="Left Semifinals"
        entries={leftSFState}
        pairs={1}
        onWinner={(_, winner) => propagateToFinal(winner, true)}
      />

      {/* Final */}
      <Column
        title="Final"
        entries={finalState}
        pairs={1}
        onWinner={(_, winner) => propagateChampion(winner)}
      />

      {/* Right Side */}
      <Column
        title="Right Semifinals"
        entries={rightSFState}
        pairs={1}
        onWinner={(_, winner) => propagateToFinal(winner, false)}
      />
      <Column
        title="Right Quarterfinals"
        entries={rightQFState}
        pairs={2}
        onWinner={(index, winner) =>
          propagateWinner(winner, index, setRightSFState)
        }
      />
      <Column
        title="Right Round of 16"
        entries={rightR16}
        pairs={4}
        onWinner={(index, winner) =>
          propagateWinner(winner, index, setRightQFState)
        }
      />

      {champion && (
        <Box gridColumn="1 / -1" textAlign="center" mt={10}>
          <Heading as="h2" size="xl" color="green.500">
            Champion: {champion}
          </Heading>
        </Box>
      )}
    </Flex>
  );
}
