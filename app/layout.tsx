import { ReactNode } from "react";
import { Provider } from "@/components/ui/provider";
import Navbar from "@/components/nav-bar";
import Footer from "@/components/footer";
import { Box } from "@chakra-ui/react";

export const metadata = {
  title: "Random Bracket - Daily Random Thing Tournaments",
  description:
    "Inspired by Hivemind, daily 16-team match-ups of completely random things. Pick a winner in a March Madness-style competition!",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider>
          <Box minHeight="100vh" display="flex" flexDirection="column">
            <Navbar />
            <Box flex="1">{children}</Box>
            <Footer />
          </Box>
        </Provider>
      </body>
    </html>
  );
}
