"use client";

import { Box, Text } from "@chakra-ui/react";
import Bracket from "@/components/bracket";

const initialEntries = [
  "Wayne Gretzki",
  "Chicken Wings",
  "Polygon",
  "Blastoise",
  "The Color Green",
  "Popeyes",
  "Bag of Marbles",
  "Elvis Presley",
  "Darth Vader",
  "A Banana Peel",
  "Cookie Monster",
  "A Rusty Spoon",
  "Mount Everest",
  "A Flamethrower",
  "Fortnite Dances",
  "A Rubber Duck",
];

// 16 distinct colors for each entry
const colors = [
  "tomato",
  "green.700",
  "blue.500",
  "yellow.600",
  "purple.500",
  "orange.500",
  "teal.600",
  "pink.800",
  "cyan.600",
  "red.500",
  "gray.600",
  "purple.800",
  "green.600",
  "brown",
  "pink.600",
  "navy",
];

// Map each entry to a color
const colorMap: { [key: string]: string } = {};
initialEntries.forEach((item, index) => {
  colorMap[item] = colors[index];
});

export default function Page() {
  return (
    <Box
      maxW="97vw"
      mx="auto"
      p={4}
      overflowX="auto"
      height="100%"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Text mb={4} textAlign="center">
        Every 24 hours we generate 16 random things. Pick a winner march madness
        bracket style.
      </Text>
      <Bracket entries={initialEntries} colorMap={colorMap} />
    </Box>
  );
}
