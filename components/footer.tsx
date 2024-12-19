import { Flex, Text } from "@chakra-ui/react";

export default function Footer() {
  return (
    <Flex as="footer" p={4} bg="teal.500" color="white" justify="center">
      <Text>
        &copy; {new Date().getFullYear()} RandomBracket. All rights reserved.
      </Text>
    </Flex>
  );
}
