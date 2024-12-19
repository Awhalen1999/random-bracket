import { Flex, Box, Heading, Link } from "@chakra-ui/react";

export default function Navbar() {
  return (
    <Flex
      as="nav"
      p={4}
      bg="teal.500"
      color="white"
      align="center"
      justify="space-between"
    >
      <Heading size="md">RandomBracket</Heading>
      <Box>
        <Link href="/" mr={4}>
          Home
        </Link>
        <Link href="/about">About</Link>
      </Box>
    </Flex>
  );
}
