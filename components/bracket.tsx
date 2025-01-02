"use client";

import { useState } from "react";
import { Flex, Box, Heading } from "@chakra-ui/react";
import Column from "./column";

interface BracketProps {
  entries: string[];
  colorMap: { [key: string]: string };
  onWinnerSelected: (winner: string) => void;
}

export default function Bracket({
  entries,
  colorMap,
  onWinnerSelected,
}: BracketProps) {
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

    if (fromLevel <= 1) {
      setLeftQFState((prev) => removeFromArray(prev));
      setLeftSFState((prev) => removeFromArray(prev));
      setRightQFState((prev) => removeFromArray(prev));
      setRightSFState((prev) => removeFromArray(prev));
      setFinalState((prev) => removeFromArray(prev));
      if (champion === oldWinner) setChampion("");
    } else if (fromLevel === 2) {
      setLeftSFState((prev) => removeFromArray(prev));
      setRightSFState((prev) => removeFromArray(prev));
      setFinalState((prev) => removeFromArray(prev));
      if (champion === oldWinner) setChampion("");
    } else if (fromLevel === 3) {
      setFinalState((prev) => removeFromArray(prev));
      if (champion === oldWinner) setChampion("");
    } else if (fromLevel === 4) {
      if (champion === oldWinner) setChampion("");
    }
  }

  function propagateWinner(
    winner: string,
    matchIndex: number,
    nextRoundSetter: React.Dispatch<React.SetStateAction<string[]>>,
    fromLevel: number
  ) {
    const nextMatchIndex = Math.floor(matchIndex / 2);
    const slot = matchIndex % 2;
    const nextIndex = nextMatchIndex * 2 + slot;

    nextRoundSetter((prev) => {
      const newArr = [...prev];
      const oldWinner = newArr[nextIndex];
      if (oldWinner !== winner) {
        newArr[nextIndex] = winner;
        if (oldWinner && oldWinner !== "" && oldWinner !== winner) {
          console.log(`[Bracket] Cleaning up old winner: "${oldWinner}"`);
          cleanupOldWinner(oldWinner, fromLevel);
        }
        console.log(
          `[Bracket] Propagating winner: "${winner}" to matchIndex: ${nextIndex}`
        );
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
          console.log(`[Bracket] Cleaning up old winner: "${oldWinner}"`);
          cleanupOldWinner(oldWinner, fromLevel);
        }
        console.log(
          `[Bracket] Propagating winner: "${winner}" to final state at index: ${index}`
        );
      }
      return newArr;
    });
  }

  function propagateChampion(winner: string) {
    const fromLevel = 4; // Final to Champion
    if (champion && champion !== winner) {
      console.log(`[Bracket] Cleaning up old champion: "${champion}"`);
      cleanupOldWinner(champion, fromLevel);
    }
    setChampion(winner);
    console.log(`[Bracket] Champion selected: "${winner}"`);
    onWinnerSelected(winner); // Notify parent
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
        title="Round of 16"
        entries={leftR16}
        pairs={4}
        onWinner={(matchIndex, winner) => {
          console.log(
            `[Bracket] Round of 16 winner: "${winner}" at matchIndex: ${matchIndex}`
          );
          propagateWinner(winner, matchIndex, setLeftQFState, 1);
        }}
        colorMap={colorMap}
      />
      <Column
        title="Quarterfinals"
        entries={leftQFState}
        pairs={2}
        onWinner={(matchIndex, winner) => {
          console.log(
            `[Bracket] Quarterfinals winner: "${winner}" at matchIndex: ${matchIndex}`
          );
          propagateToSF(winner, matchIndex, true);
        }}
        colorMap={colorMap}
      />
      <Column
        title="Semifinals"
        entries={leftSFState}
        pairs={1}
        onWinner={(matchIndex, winner) => {
          console.log(
            `[Bracket] Semifinals winner: "${winner}" at matchIndex: ${matchIndex}`
          );
          propagateToFinalFromSF(winner, matchIndex, true);
        }}
        colorMap={colorMap}
      />

      {/* Final */}
      <Column
        title="Final"
        entries={finalState}
        pairs={1}
        onWinner={(matchIndex, winner) => {
          console.log(
            `[Bracket] Final winner: "${winner}" at matchIndex: ${matchIndex}`
          );
          propagateChampion(winner);
        }}
        colorMap={colorMap}
      />

      {/* Right Side */}
      <Column
        title="Semifinals"
        entries={rightSFState}
        pairs={1}
        onWinner={(matchIndex, winner) => {
          console.log(
            `[Bracket] Semifinals winner: "${winner}" at matchIndex: ${matchIndex}`
          );
          propagateToFinalFromSF(winner, matchIndex, false);
        }}
        colorMap={colorMap}
      />
      <Column
        title="Quarterfinals"
        entries={rightQFState}
        pairs={2}
        onWinner={(matchIndex, winner) => {
          console.log(
            `[Bracket] Quarterfinals winner: "${winner}" at matchIndex: ${matchIndex}`
          );
          propagateToSF(winner, matchIndex, false);
        }}
        colorMap={colorMap}
      />
      <Column
        title="Round of 16"
        entries={rightR16}
        pairs={4}
        onWinner={(matchIndex, winner) => {
          console.log(
            `[Bracket] Round of 16 winner: "${winner}" at matchIndex: ${matchIndex}`
          );
          propagateWinner(winner, matchIndex, setRightQFState, 1);
        }}
        colorMap={colorMap}
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
