"use client";

import { useState } from "react";
import { Flex, Box, Heading } from "@chakra-ui/react";
import Column from "./column";

interface BracketProps {
  entries: string[];
}

// Round levels for reference:
// R16 = 1, QF = 2, SF = 3, Final = 4

export default function Bracket({ entries }: BracketProps) {
  const leftR16 = entries.slice(0, 8);
  const rightR16 = entries.slice(8, 16);

  const [leftQFState, setLeftQFState] = useState(Array(4).fill(""));
  const [leftSFState, setLeftSFState] = useState(Array(2).fill(""));

  const [rightQFState, setRightQFState] = useState(Array(4).fill(""));
  const [rightSFState, setRightSFState] = useState(Array(2).fill(""));

  const [finalState, setFinalState] = useState(Array(2).fill(""));
  const [champion, setChampion] = useState<string>("");

  function cleanupOldWinner(oldWinner: string, fromLevel: number) {
    if (!oldWinner) return;

    const removeFromArray = (arr: string[]) =>
      arr.map((val) => (val === oldWinner ? "" : val));

    // Remove from downstream rounds only:
    // If fromLevel=1 (R16), remove from QF, SF, Final, champion
    // If fromLevel=2 (QF), remove from SF, Final, champion
    // If fromLevel=3 (SF), remove from Final, champion
    // If fromLevel=4 (Final), remove from champion only

    if (fromLevel <= 1) {
      setLeftQFState((prev) => removeFromArray(prev));
      setLeftSFState((prev) => removeFromArray(prev));
      setRightQFState((prev) => removeFromArray(prev));
      setRightSFState((prev) => removeFromArray(prev));
      setFinalState((prev) => removeFromArray(prev));
      if (champion === oldWinner) setChampion("");
    } else if (fromLevel === 2) {
      // QF changed => remove from SF, Final, champion
      setLeftSFState((prev) => removeFromArray(prev));
      setRightSFState((prev) => removeFromArray(prev));
      setFinalState((prev) => removeFromArray(prev));
      if (champion === oldWinner) setChampion("");
    } else if (fromLevel === 3) {
      // SF changed => remove from Final, champion
      setFinalState((prev) => removeFromArray(prev));
      if (champion === oldWinner) setChampion("");
    } else if (fromLevel === 4) {
      // Final changed => remove from champion
      if (champion === oldWinner) setChampion("");
    }
  }

  function propagateWinner(
    winner: string,
    fromMatchIndex: number,
    nextRoundSetter: React.Dispatch<React.SetStateAction<string[]>>,
    fromLevel: number
  ) {
    const nextMatchIndex = Math.floor(fromMatchIndex / 2);
    const slot = fromMatchIndex % 2;
    const nextIndex = nextMatchIndex * 2 + slot;

    nextRoundSetter((prev) => {
      const newArr = [...prev];
      const oldWinner = newArr[nextIndex];
      if (oldWinner !== winner) {
        newArr[nextIndex] = winner;
        if (oldWinner && oldWinner !== "" && oldWinner !== winner) {
          cleanupOldWinner(oldWinner, fromLevel);
        }
      }
      return newArr;
    });
  }

  function propagateToSF(
    winner: string,
    matchIndex: number,
    isLeftSide: boolean
  ) {
    const nextRoundSetter = isLeftSide ? setLeftSFState : setRightSFState;
    const fromLevel = 2; // QF to SF
    propagateWinner(winner, matchIndex, nextRoundSetter, fromLevel);
  }

  function propagateToFinalFromSF(
    winner: string,
    matchIndex: number,
    isLeftSide: boolean
  ) {
    const fromLevel = 3; // SF to Final
    const index = isLeftSide ? 0 : 1;
    setFinalState((prev) => {
      const newArr = [...prev];
      const oldWinner = newArr[index];
      if (oldWinner !== winner) {
        newArr[index] = winner;
        if (oldWinner && oldWinner !== "" && oldWinner !== winner) {
          cleanupOldWinner(oldWinner, fromLevel);
        }
      }
      return newArr;
    });
  }

  function propagateChampion(winner: string) {
    const fromLevel = 4; // Final to Champion
    if (champion && champion !== winner) {
      cleanupOldWinner(champion, fromLevel);
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
        onWinner={(matchIndex, winner) => {
          // R16 to QF is fromLevel = 1
          propagateWinner(winner, matchIndex, setLeftQFState, 1);
        }}
      />
      <Column
        title="Left Quarterfinals"
        entries={leftQFState}
        pairs={2}
        onWinner={(matchIndex, winner) => {
          propagateToSF(winner, matchIndex, true);
        }}
      />
      <Column
        title="Left Semifinals"
        entries={leftSFState}
        pairs={1}
        onWinner={(matchIndex, winner) => {
          // SF to Final is fromLevel = 3
          propagateToFinalFromSF(winner, matchIndex, true);
        }}
      />

      {/* Final */}
      <Column
        title="Final"
        entries={finalState}
        pairs={1}
        onWinner={(matchIndex, winner) => {
          propagateChampion(winner);
        }}
      />

      {/* Right Side */}
      <Column
        title="Right Semifinals"
        entries={rightSFState}
        pairs={1}
        onWinner={(matchIndex, winner) => {
          propagateToFinalFromSF(winner, matchIndex, false);
        }}
      />
      <Column
        title="Right Quarterfinals"
        entries={rightQFState}
        pairs={2}
        onWinner={(matchIndex, winner) => {
          propagateToSF(winner, matchIndex, false);
        }}
      />
      <Column
        title="Right Round of 16"
        entries={rightR16}
        pairs={4}
        onWinner={(matchIndex, winner) => {
          propagateWinner(winner, matchIndex, setRightQFState, 1);
        }}
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
