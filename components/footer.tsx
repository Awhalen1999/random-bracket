import { Flex, Text, Image, Link, HStack } from "@chakra-ui/react";
import { FaGithub, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <Flex as="footer" px={4} justify="space-between" align="center">
      <HStack>
        <Text fontSize="md">Inspired by</Text>
        <Image
          src="/hivemind-logo.png"
          alt="Hivemind Logo"
          height="64px"
          width="auto"
        />
      </HStack>
      <HStack>
        <Link href="https://github.com/Awhalen1999">
          <FaGithub />
        </Link>
      </HStack>
    </Flex>
  );
}
