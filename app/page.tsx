"use client";

import { Box, Heading, Text } from "@chakra-ui/react";
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
      <Bracket entries={initialEntries} />
    </Box>
  );
}
