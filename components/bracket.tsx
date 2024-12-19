"use client";

import { useState } from "react";
import { Flex, Box, Heading } from "@chakra-ui/react";
import Column from "./column";

interface BracketProps {
  entries: string[];
}

export default function Bracket({ entries }: BracketProps) {
  const leftR16 = entries.slice(0, 8); // Left side Round of 16
  const rightR16 = entries.slice(8, 16); // Right side Round of 16

  // State for subsequent rounds
  const [leftQFState, setLeftQFState] = useState(Array(4).fill("")); // Left Quarterfinals
  const [leftSFState, setLeftSFState] = useState(Array(2).fill("")); // Left Semifinal

  const [rightQFState, setRightQFState] = useState(Array(4).fill("")); // Right Quarterfinals
  const [rightSFState, setRightSFState] = useState(Array(2).fill("")); // Right Semifinal

  const [finalState, setFinalState] = useState(Array(2).fill("")); // Final (2 entries: left finalist, right finalist)
  const [champion, setChampion] = useState<string>("");

  function cleanupOldWinner(oldWinner: string) {
    if (!oldWinner) return;
    const removeFromArray = (arr: string[]) =>
      arr.map((val) => (val === oldWinner ? "" : val));

    setLeftQFState((prev) => removeFromArray(prev));
    setLeftSFState((prev) => removeFromArray(prev));
    setRightQFState((prev) => removeFromArray(prev));
    setRightSFState((prev) => removeFromArray(prev));
    setFinalState((prev) => removeFromArray(prev));

    if (champion === oldWinner) {
      setChampion("");
    }
  }

  function propagateWinner(
    winner: string,
    fromMatchIndex: number,
    nextRoundSetter: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    // Calculate next index in the next round's array
    const nextMatchIndex = Math.floor(fromMatchIndex / 2);
    const slot = fromMatchIndex % 2;
    const nextIndex = nextMatchIndex * 2 + slot;

    nextRoundSetter((prev) => {
      const newArr = [...prev];
      const oldWinner = newArr[nextIndex];
      if (oldWinner !== winner) {
        newArr[nextIndex] = winner;
        if (oldWinner && oldWinner !== "" && oldWinner !== winner) {
          cleanupOldWinner(oldWinner);
        }
      }
      return newArr;
    });
  }

  function propagateToFinalFromSF(winner: string, isLeftSide: boolean) {
    // FinalState: [0] = left finalist, [1] = right finalist
    const index = isLeftSide ? 0 : 1;
    setFinalState((prev) => {
      const newArr = [...prev];
      const oldWinner = newArr[index];
      if (oldWinner !== winner) {
        newArr[index] = winner;
        if (oldWinner && oldWinner !== winner) {
          cleanupOldWinner(oldWinner);
        }
      }
      return newArr;
    });
  }

  function propagateChampion(winner: string) {
    if (champion && champion !== winner) {
      cleanupOldWinner(champion);
    }
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
        onWinner={(matchIndex, winner) =>
          propagateWinner(winner, matchIndex, setLeftQFState)
        }
      />
      <Column
        title="Left Quarterfinals"
        entries={leftQFState}
        pairs={2}
        onWinner={(matchIndex, winner) =>
          propagateWinner(winner, matchIndex, setLeftSFState)
        }
      />
      <Column
        title="Left Semifinals"
        entries={leftSFState}
        pairs={1}
        onWinner={(matchIndex, winner) => {
          // Left SF winner goes directly into finalState[0]
          propagateToFinalFromSF(winner, true);
        }}
      />

      {/* Final */}
      <Column
        title="Final"
        entries={finalState}
        pairs={1}
        onWinner={(matchIndex, winner) => {
          // Selecting final winner sets champion
          propagateChampion(winner);
        }}
      />

      {/* Right Side */}
      <Column
        title="Right Semifinals"
        entries={rightSFState}
        pairs={1}
        onWinner={(matchIndex, winner) => {
          // Right SF winner goes directly into finalState[1]
          propagateToFinalFromSF(winner, false);
        }}
      />
      <Column
        title="Right Quarterfinals"
        entries={rightQFState}
        pairs={2}
        onWinner={(matchIndex, winner) =>
          propagateWinner(winner, matchIndex, setRightSFState)
        }
      />
      <Column
        title="Right Round of 16"
        entries={rightR16}
        pairs={4}
        onWinner={(matchIndex, winner) =>
          propagateWinner(winner, matchIndex, setRightQFState)
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
