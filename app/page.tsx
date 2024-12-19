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
      maxW="95vw"
      mx="auto"
      p={4}
      overflowX="auto"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
    >
      <Heading as="h1" mb={8} textAlign="center">
        RandomBracket
      </Heading>
      <Text mb={4} textAlign="center">
        Every 24h we generate 16 random funny items. Pick winners and watch them
        advance instantly!
      </Text>
      <Bracket entries={initialEntries} />
    </Box>
  );
}
