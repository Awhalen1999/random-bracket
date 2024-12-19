"use client";
import { useState } from "react";
import { Flex, Box, Heading } from "@chakra-ui/react";
import Column from "./column";

interface BracketProps {
  entries: string[];
}

export default function Bracket({ entries }: BracketProps) {
  const leftR16 = entries.slice(0, 8); // 8 entries
  const rightR16 = entries.slice(8, 16); // 8 entries

  // Each round stored as flat arrays:
  // For a round with N matches, we have N*2 entries.
  // Empty means no contender yet.
  const [leftQFState, setLeftQFState] = useState(Array(4).fill(""));
  const [leftSFState, setLeftSFState] = useState(Array(2).fill(""));
  const [leftFState, setLeftFState] = useState(Array(1).fill(""));

  const [rightQFState, setRightQFState] = useState(Array(4).fill(""));
  const [rightSFState, setRightSFState] = useState(Array(2).fill(""));
  const [rightFState, setRightFState] = useState(Array(1).fill(""));

  const [finalState, setFinalState] = useState(Array(2).fill(""));
  const [champion, setChampion] = useState<string>("");

  function propagateWinner(
    winner: string,
    fromMatchIndex: number,
    currentRoundSize: number,
    nextRoundSetter: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    // nextMatchIndex = floor(fromMatchIndex / 2)
    // slot = fromMatchIndex % 2
    // nextIndex = nextMatchIndex*2 + slot
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
        entries={leftR16} // 8 entries
        pairs={4}
        onWinner={(index, winner) =>
          propagateWinner(winner, index, 8, setLeftQFState)
        }
      />
      <Column
        title="Left Quarterfinals"
        entries={leftQFState} // 4 entries (2 matches)
        pairs={2}
        onWinner={(index, winner) =>
          propagateWinner(winner, index, 4, setLeftSFState)
        }
      />
      <Column
        title="Left Semifinals"
        entries={leftSFState} // 2 entries (1 match)
        pairs={1}
        onWinner={(index, winner) => propagateToFinal(winner, true)}
      />

      {/* Final */}
      <Column
        title="Final"
        entries={finalState} // 2 entries
        pairs={1}
        onWinner={(index, winner) => propagateChampion(winner)}
      />

      {/* Right Side */}
      <Column
        title="Right Semifinals"
        entries={rightSFState} // 2 entries
        pairs={1}
        onWinner={(index, winner) => propagateToFinal(winner, false)}
      />
      <Column
        title="Right Quarterfinals"
        entries={rightQFState} // 4 entries
        pairs={2}
        onWinner={(index, winner) =>
          propagateWinner(winner, index, 4, setRightSFState)
        }
      />
      <Column
        title="Right Round of 16"
        entries={rightR16} // 8 entries
        pairs={4}
        onWinner={(index, winner) =>
          propagateWinner(winner, index, 8, setRightQFState)
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
