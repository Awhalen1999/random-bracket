"use client";

import { Flex, Box, Heading, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <Flex as="nav" p={4} align="center" justify="space-between">
      <Button variant="ghost" onClick={() => router.push("/")}>
        <Heading size="md">Random Bracket</Heading>
      </Button>
      <Box>
        <Button onClick={() => router.push("/stats")}>Stats</Button>
      </Box>
    </Flex>
  );
}
