"use client";

import { useState } from "react";
import { Flex, Box, Heading } from "@chakra-ui/react";
import Column from "./column";

interface BracketProps {
  entries: string[];
}

export default function Bracket({ entries }: BracketProps) {
  const leftR16 = entries.slice(0, 8); // 8 entries, 4 matches
  const rightR16 = entries.slice(8, 16); // 8 entries, 4 matches

  // State for downstream rounds
  const [leftQFState, setLeftQFState] = useState(Array(4).fill(""));
  const [leftSFState, setLeftSFState] = useState(Array(2).fill(""));
  const [leftFinalist, setLeftFinalist] = useState(Array(1).fill(""));

  const [rightQFState, setRightQFState] = useState(Array(4).fill(""));
  const [rightSFState, setRightSFState] = useState(Array(2).fill(""));
  const [rightFinalist, setRightFinalist] = useState(Array(1).fill(""));

  const [finalState, setFinalState] = useState(Array(2).fill(""));
  const [champion, setChampion] = useState<string>("");

  function cleanupOldWinner(oldWinner: string) {
    if (!oldWinner) return;
    // Remove oldWinner from all arrays
    const removeFromArray = (arr: string[]) =>
      arr.map((val) => (val === oldWinner ? "" : val));

    setLeftQFState((prev) => removeFromArray(prev));
    setLeftSFState((prev) => removeFromArray(prev));
    setLeftFinalist((prev) => removeFromArray(prev));
    setRightQFState((prev) => removeFromArray(prev));
    setRightSFState((prev) => removeFromArray(prev));
    setRightFinalist((prev) => removeFromArray(prev));
    setFinalState((prev) => removeFromArray(prev));

    // If champion was oldWinner, remove it
    if (champion === oldWinner) {
      setChampion("");
    }
  }

  function propagateWinner(
    winner: string,
    fromMatchIndex: number,
    nextRoundSetter: React.Dispatch<React.SetStateAction<string[]>>,
    currentRoundSize: number
  ) {
    // Determine where to put this winner in next round
    // Each pair in next round is formed by 2 matches from the previous round.
    const nextMatchIndex = Math.floor(fromMatchIndex / 2);
    const slot = fromMatchIndex % 2;
    const nextIndex = nextMatchIndex * 2 + slot;

    nextRoundSetter((prev) => {
      const newArr = [...prev];
      const oldWinner = newArr[nextIndex];
      if (oldWinner !== winner) {
        newArr[nextIndex] = winner;
        // If we replaced an old winner, cleanup
        if (oldWinner && oldWinner !== "" && oldWinner !== winner) {
          cleanupOldWinner(oldWinner);
        }
      }
      return newArr;
    });
  }

  // Special propagate for SF -> Final and Final -> Champion
  function propagateToFinal(winner: string, isLeftSide: boolean) {
    // For finalState: index 0 = left finalist, index 1 = right finalist
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
    if (champion !== winner && champion) {
      // If old champion changed, cleanup old champion
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
          propagateWinner(winner, matchIndex, setLeftQFState, 8)
        }
      />
      <Column
        title="Left Quarterfinals"
        entries={leftQFState}
        pairs={2}
        onWinner={(matchIndex, winner) =>
          propagateWinner(winner, matchIndex, setLeftSFState, 4)
        }
      />
      <Column
        title="Left Semifinals"
        entries={leftSFState}
        pairs={1}
        onWinner={(matchIndex, winner) => {
          // SF to finalist is like propagateWinner but there's only one slot
          // Actually we have leftFinalist[0]
          setLeftFinalist((prev) => {
            const oldWinner = prev[0];
            if (oldWinner !== winner) {
              const newArr = [winner];
              if (oldWinner && oldWinner !== winner) {
                cleanupOldWinner(oldWinner);
              }
              return newArr;
            }
            return prev;
          });
        }}
      />

      {/* Final */}
      <Column
        title="Final"
        entries={finalState}
        pairs={1}
        onWinner={(matchIndex, winner) => {
          // Final chosen winner = champion
          // Note: If finalState changed from oldWinner to winner, already cleaned up in propagate logic
          propagateChampion(winner);
        }}
      />

      {/* Right Side */}
      <Column
        title="Right Semifinals"
        entries={rightSFState}
        pairs={1}
        onWinner={(matchIndex, winner) => {
          setRightFinalist((prev) => {
            const oldWinner = prev[0];
            if (oldWinner !== winner) {
              const newArr = [winner];
              if (oldWinner && oldWinner !== winner) {
                cleanupOldWinner(oldWinner);
              }
              return newArr;
            }
            return prev;
          });
        }}
      />
      <Column
        title="Right Quarterfinals"
        entries={rightQFState}
        pairs={2}
        onWinner={(matchIndex, winner) =>
          propagateWinner(winner, matchIndex, setRightSFState, 4)
        }
      />
      <Column
        title="Right Round of 16"
        entries={rightR16}
        pairs={4}
        onWinner={(matchIndex, winner) =>
          propagateWinner(winner, matchIndex, setRightQFState, 8)
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
